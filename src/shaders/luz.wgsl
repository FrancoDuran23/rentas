// luz.wgsl — Luz ambiental en movimiento para la portada.
//
// Tres masas de luz celeste (el de los arcos del isologo) derivan por
// trayectorias de Lissajous de 7,5 a 10 s por eje: el movimiento se nota sin
// mirarlo, con dirección, como luz que se desplaza y no como humo. Viven
// arriba y a la derecha; abajo a la izquierda (fila "Más buscados", enlaces
// azules) la luz se apaga para que el texto mantenga 4,5:1. Los colores
// llegan como uniforms (sRGB) para servir en modo claro y oscuro.
//
// Todo es periódico en PERIOD segundos (los períodos dividen a PERIOD), así
// el reloj del host puede envolverse en ese valor sin ningún salto.
import { simplex2d } from "@vgpu/wgsl-std/noise/simplex";
import { hash2 } from "@vgpu/wgsl-std/hash";
import { srgbToLinear3, linearToSrgb3 } from "@vgpu/wgsl-std/color";

struct Params {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  amount: f32,
  grain: f32,
  top: vec3f,
  bottom: vec3f,
  glow: vec3f,
  // Rectángulo (uv: x0, y0, x1, y1) donde la luz se topea en 0,45 para que texto
  // azul encima mantenga 4,5:1. Hoy el inicio no lo usa (todo va en tinta o sobre
  // fondo propio): en cero no hace nada.
  clear: vec4f,
}

@group(0) @binding(0) var<uniform> params: Params;

const TAU: f32 = 6.28318530718;
const PERIOD: f32 = 1200.0;

/* Masa de luz suave: 1 en el centro, ~0.2 en el radio, nada más allá. */
fn mass(p: vec2f, c: vec2f, r: f32) -> f32 {
  let d = length(p - c) / r;
  return exp(-1.6 * d * d);
}

/* Deriva lenta: óvalo de Lissajous. nx, ny son enteros → el ciclo cierra en PERIOD. */
fn drift(t: f32, amp: vec2f, nx: f32, ny: f32, phase: vec2f) -> vec2f {
  return amp * vec2f(sin(TAU * (t * nx / PERIOD) + phase.x), sin(TAU * (t * ny / PERIOD) + phase.y));
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let res = params.resolution;
  let aspect = res.x / max(res.y, 1.0);
  // Unidades físicas: el lado corto mide 1, así el tamaño de las masas
  // no depende de la altura de la banda ni del aspecto.
  let s = min(res.x, res.y);
  let scale = res / s;
  let p = uv * scale;
  let t = params.time;
  // El puntero (sólo escritorio) corre las masas unos píxeles, nada más.
  let nudge = (params.pointer - 0.5) * 0.02;

  // Composición apaisada: las masas viven arriba y a la derecha.
  // Períodos (s): 8/10, 10/7,5, 9,2/8 → n = PERIOD / T (enteros).
  let amp = vec2f(0.12 * scale.x, 0.26 * scale.y);
  let a1 = vec2f(0.78, 0.22) * scale + drift(t, amp, 150.0, 120.0, vec2f(0.0, 1.7)) + nudge;
  let a2 = vec2f(0.97, 0.80) * scale + drift(t, amp, 120.0, 160.0, vec2f(2.1, 0.6)) + nudge;
  let a3 = vec2f(0.55, -0.08) * scale + drift(t, amp, 130.0, 150.0, vec2f(4.0, 2.9)) + nudge;
  let wide = 0.80 * mass(p, a1, 0.70) + 0.60 * mass(p, a2, 0.62) + 0.55 * mass(p, a3, 0.60);

  // Composición vertical (móvil): una masa grande arriba a la derecha, casi
  // fuera del lienzo, y otra más tenue abajo a la izquierda detrás de los
  // accesos directos. El texto ocupa todo el ancho, por eso la luz es más baja.
  let b1 = vec2f(0.95, 0.04) * scale + drift(t, vec2f(0.18, 0.10 * scale.y), 150.0, 120.0, vec2f(0.0, 1.7));
  let b2 = vec2f(0.10, 0.95) * scale + drift(t, vec2f(0.18, 0.08 * scale.y), 120.0, 160.0, vec2f(2.1, 0.6));
  let tall = min(0.85, 0.95 * mass(p, b1, 0.95) + 0.55 * mass(p, b2, 0.75));

  // Un toque de ruido de una sola octava para que las masas no sean círculos
  // perfectos; su deriva también es circular, y por eso periódica.
  let ring = vec2f(cos(TAU * t / PERIOD), sin(TAU * t / PERIOD)) * 1.9;
  let w = 0.12 * simplex2d(p * 0.9 + ring);

  let k = smoothstep(0.7, 0.95, aspect);
  var veil = clamp(mix(tall, wide, k) + w * mix(0.6, 1.0, k), 0.0, 1.0);
  // Claro quieto alrededor de un texto azul (uniform `clear`): ahí la luz
  // se topea en 0,45, que en claro deja el fondo ≥ 0,75 de luminancia y en
  // oscuro ≤ 0,05 (4,5:1 con el azul de cada tema). Se mide en píxeles para
  // que el margen no dependa del tamaño del hero; pasa luz, no hay un hueco.
  let px = uv * res;
  let r0 = params.clear.xy * res;
  let r1 = params.clear.zw * res;
  let dist = length(max(max(r0 - px, px - r1), vec2f(0.0)));
  let hasClear = step(0.001, params.clear.z - params.clear.x);
  veil = min(veil, mix(1.0, mix(0.45, 1.0, smoothstep(24.0, 140.0, dist)), hasClear));

  // Base: degradé vertical casi imperceptible; encima, el velo.
  var col = mix(srgbToLinear3(params.top), srgbToLinear3(params.bottom), smoothstep(0.0, 1.0, uv.y));
  col = mix(col, srgbToLinear3(params.glow), veil * params.amount);

  var srgb = linearToSrgb3(col);
  // Grano fijo en el píxel (no se resiembra por cuadro): quita el bandeado sin titilar.
  let h = hash2(floor(uv * res)).x - 0.5;
  srgb += vec3f(h * params.grain);
  return vec4f(srgb, 1.0);
}
