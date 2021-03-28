import { FProp, Shape, TileProps, union, Vec3 } from "./base";
import { Shape3 } from "./base3";
import { indent, serialize } from "./openscad-util";


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

export class Shape2 extends Shape<{ dim: 2 }> {

  // 2d only functions
  linear_extrude(p: ExtrudeProps) {
    return new Shape3([`linear_extrude(${serialize(p)})`, ...this.src.map(indent)]);
  }

  rotate_extrude(p?: RotateExtrudeProps) {
    return new Shape3([`rotate_extrude(${serialize(p)})`, ...this.src.map(indent)]);
  }

  // common funcs
  union(s: Shape2, ...rest: Shape2[]): Shape2 {
    const src = super.union(s, ...rest).src;
    return new Shape2(src);
  }

  difference(s: Shape2, ...rest: Shape2[]): Shape2 {
    const src = super.difference(s, ...rest).src;
    return new Shape2(src);
  }

  intersection(s: Shape2, ...rest: Shape2[]): Shape2 {
    const src = super.intersection(s, ...rest).src;
    return new Shape2(src);
  }

  scale(p: Vec3) {
    const src = super.scale(p).src;
    return new Shape2(src);
  }

  translate(p: Vec3) {
    const src = super.translate(p).src;
    return new Shape2(src);
  };

  rotate(p: Vec3) {
    const src = super.rotate(p).src;
    return new Shape2(src);
  };

  mirror(p: Vec3) {
    const src = super.mirror(p).src;
    return new Shape2(src);
  };

  color(p: string) {
    const src = super.color(p).src;
    return new Shape2(src);
  };

  tile(p: TileProps): Shape2 {
    const src = super.tile(p).src;
    return new Shape2(src);
  }
}