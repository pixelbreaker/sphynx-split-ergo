import { indent, shape3 } from "./openscad-util";

export const translate = (p: Vec3, s: Shape3): Shape3 => {
  return shape3(`translate(${JSON.stringify(p)}) \n${indent(s.src)}`);
};

export const rotate = (p: Vec3, s: Shape3): Shape3 => {
  return shape3(`rotate(${JSON.stringify(p)}) \n${indent(s.src)}`);
};

export const mirror = (p: Vec3, s: Shape3): Shape3 => {
  return shape3(`mirror(${JSON.stringify(p)}) \n${indent(s.src)}`);
};

/**
 * 
 * @param c hex string or color name
 * @param s 
 * @returns colored shaped
 */
export const color = (c: string, s: Shape3): Shape3 => {
  return shape3(`color("${s}") \n${indent(s.src)}`);
};

