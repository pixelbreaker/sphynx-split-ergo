import { indent, shape } from "./openscad-util";

export const translate = <T extends Shape>(p: Vec3, s: T): T => {
  return shape<T>(`translate(${JSON.stringify(p)}) \n${indent(s.src)}`);
};

export const rotate = <T extends Shape>(p: Vec3, s: T): T => {
  return shape<T>(`rotate(${JSON.stringify(p)}) \n${indent(s.src)}`);
};

export const mirror = <T extends Shape>(p: Vec3, s: T): T => {
  return shape<T>(`mirror(${JSON.stringify(p)}) \n${indent(s.src)}`);
};

/**
 * 
 * @param c hex string or color name
 * @param s 
 * @returns colored shaped
 */
export const color = <T extends Shape>(c: string, s: T): T => {
  return shape<T>(`color("${s}") \n${indent(s.src)}`);
};

