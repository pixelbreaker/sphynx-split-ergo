import { expand, indent, serialize } from "./openscad-util";

export type ExtrudeProps = FProp<{
  height: number,
  center?: boolean,
  convexity?: number,
  twist?: number,
  slices?: number,
  scale?: number,
}>;

export type RotateExtrudeProps = FProp<{
  angle?: number,
  convexity?: number
}>;

export const union = <T>(...s: Shape<T>[]): Shape<T> =>
  new Shape<T>(`union()` + expand(s));

export const difference = <T>(...s: Shape<T>[]): Shape<T> =>
  new Shape<T>(`difference()` + expand(s));

export const intersection = <T>(...s: Shape<T>[]): Shape<T> =>
  new Shape<T>(`intersection()` + expand(s));

export const hull = <T>(...s: Shape<T>[]): Shape<T> =>
  new Shape<T>(`hull()` + expand(s));

export const minkowski = <T>(...s: Shape<T>[]): Shape<T> =>
  new Shape<T>(`minkowski()` + expand(s));


export class Shape<T> {
  src: string;
  props: T;
  constructor(src: string) {
    this.src = src;
  }

  union(...s: Shape<T>[]): Shape<T> {
    return union(this, ...s);
  }

  difference(...s: Shape<T>[]): Shape<T> {
    return difference<T>(this, ...s);
  }

  intersection(...s: Shape<T>[]): Shape<T> {
    return intersection<T>(this, ...s);
  }

  scale(p: Vec3) {
    return new Shape<T>(`scale(${serialize(p)}) \n${indent(this.src)}`);
  }

  translate(p: Vec3) {
    return new Shape<T>(`translate(${JSON.stringify(p)}) \n${indent(this.src)}`);
  };

  rotate(p: Vec3) {
    return new Shape<T>(`rotate(${JSON.stringify(p)}) \n${indent(this.src)}`);
  };

  mirror(p: Vec3) {
    return new Shape<T>(`mirror(${JSON.stringify(p)}) \n${indent(this.src)}`);
  };

  color(c: string) {
    return new Shape<T>(`color("${c}") \n${indent(this.src)}`);
  };
}

export class Shape2 extends Shape<{ dim: 2 }> {
  dim: 2; // added to ensure that Shape2 and Shape3 do not fit

  linear_extrude(p: ExtrudeProps) {
    return new Shape3(`linear_extrude(${serialize(p)}) \n${indent(this.src)}`);
  }

  rotate_extrude(p: RotateExtrudeProps) {
    return new Shape3(`rotate_extrude(${serialize(p)}) \n${indent(this.src)}`);
  }
}

export class Shape3 extends Shape<{ dim: 3 }> {
  dim: 3; // added to ensure that Shape2 and Shape3 do not fit
}