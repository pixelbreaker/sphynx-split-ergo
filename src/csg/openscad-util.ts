import { color, mirror, rotate, translate } from "./manipulate";

export const serialize = (o: any) => {
  if (Array.isArray(o) || typeof o !== 'object') {
    return JSON.stringify(o);
  }
  return Object.entries(o)
    .map(([key, val]) => `${key} = ${JSON.stringify(val)}`)
    .join(',');
}
export const indent = (s: string) => s.split('\n').map(r => '  ' + r).join('\n');

export const shape = <T extends Shape>(s: string): T => {
  const shape = {
    src: s,
    translate: (p: Vec3) => translate(p, shape),
    rotate: (p: Vec3) => rotate(p, shape),
    mirror: (p: Vec3) => mirror(p, shape),
    color: (c: string) => color(c, shape)
  } as Shape<T>;

  return shape;
}
export const shape2 = (s: string) => shape<Shape2>(s);
export const shape3 = (s: string) => shape<Shape3>(s);