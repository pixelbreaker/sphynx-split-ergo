import { shape2, shape3 } from "./openscad-util";

const expand = (s: Shape[]) => `{\n${s.map(k => '\t'+k.src).join('\n')}\n}`;

export const union2 = (...s: Shape2[]): Shape2 => {
  return shape2(`union()` + expand(s));
}

export const union = (...s: Shape3[]): Shape3 => {
  return shape3(`union()` + expand(s));
}

export const difference2 = (...s: Shape2[]): Shape2 => {
  return shape2(`difference()` + expand(s));
}

export const difference = (...s: Shape3[]): Shape3 => {
  return shape3(`difference()` + expand(s));
}

export const hull2 = (...s: Shape2[]): Shape2 => {
  return shape2(`hull()` + expand(s));
}

export const hull = (...s: Shape3[]): Shape3 => {
  return shape3(`hull()` + expand(s));
}

export const minkowski2 = (...s: Shape2[]): Shape2 => {
  return shape2(`minkowski()` + expand(s));
}

export const minkowski = (...s: Shape3[]): Shape3 => {
  return shape3(`minkowski()` + expand(s));
}