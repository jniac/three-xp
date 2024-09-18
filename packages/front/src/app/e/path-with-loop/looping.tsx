
export const looping = (out: { x: number; y: number }, t: number, {
  h = .3,
  w = 1,
  p = 3,
  q = 1,
  a = .3,
} = {}) => {
  const t2 = t ** q
  out.x = (t + a * Math.sin(t2 * Math.PI * 2)) * w
  out.y = h * Math.pow(Math.sin(t2 * Math.PI), p)
}

export const glsl_looping = /* glsl */`
vec2 looping(float t, float h, float w, float p, float q, float a) {
  float t2 = pow(t, q);
  return vec2(
    (t + a * sin(t2 * PI * 2.0)) * w,
    h * pow(sin(t2 * PI), p)
  );
}

vec2 looping(float t) {
  return looping(t, 0.3, 1.0, 3.0, 1.0, 0.3);
}
`