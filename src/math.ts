
type Vec3 = [number, number, number];

export const minus = ([a, b, c]: Vec3, [x, y, z]: Vec3) => [a - x, b - y, c - z] as Vec3;
export const add = ([a, b, c]: Vec3, [x, y, z]: Vec3) => [a + x, b + y, c + z] as Vec3;
export const dot = ([a, b, c]: Vec3, [x, y, z]: Vec3) => a * x + b * y + c * z;
export const scale = (a: number, [x, y, z]: Vec3) => [a * x, a * y, a * z] as Vec3;
export const length = ([a, b, c]: Vec3) => Math.sqrt(a * a + b * b + c * c);
export const normalize = (a: Vec3) => scale(1 / length(a), a);
export const cross = ([a, b, c]: Vec3, [x, y, z]: Vec3) => [
  b * z - c * y,
  c * x - a * z,
  a * y - b * x
] as Vec3;