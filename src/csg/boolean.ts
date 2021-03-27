import { indent, shape } from "./openscad-util";


const expand = (s: Shape<unknown>[]) => `{\n${s.map(k => indent(k.src)).join('\n')}\n}`;
type UnionShape = Shape2 | Shape3;


export const union = <T extends UnionShape>(...s: T[]): T => {
  return shape<T>(`union()` + expand(s));
}


export const difference = <T extends UnionShape>(...s: T[]): T => {
  return shape<T>(`difference()` + expand(s));
}


export const hull = <T extends UnionShape>(...s: T[]): T => {
  return shape<T>(`hull()` + expand(s));
}


export const minkowski = <T extends UnionShape>(...s: T[]): T => {
  return shape<T>(`minkowski()` + expand(s));
}