import { FProp, Shape, TileCircularProps, TileProps, Vec3 } from "./base";
import { shape3 } from "./base3";
import { indent, serialize } from "./translation-util";

export const shape2 = <T>(s: string[], t: T) => {
  const sh = new Shape2(s);
  Object.assign(sh, t);
  return sh as (Shape2 & T);
}

export type ExtrudeProps = FProp<{
  height: number,
  center?: boolean,
  convexity?: number,
  twist?: number,
  slices?: number,
  scale?: number[],
}>;

export type RotateExtrudeProps = FProp<{
  angle?: number,
  convexity?: number
}>;

export type OffsetProps = {
  r?: number;
  delta?: number;
  chamfer?: boolean;
}

export class Shape2 extends Shape {

  // 2d only functions
  linear_extrude(p: ExtrudeProps) {
    if (p.center === undefined) {
      p.center = true;
    }
    return shape3([`linear_extrude(${serialize(p)})`, ...this.src.map(indent)], p);
  }

  rotate_extrude(p?: RotateExtrudeProps) {
    return shape3([`rotate_extrude(${serialize(p)})`, ...this.src.map(indent)], p);
  }

  // 'upgrade' common funcs
  union(...s: Shape2[]): Shape2 {
    const src = super.union(...s).src;
    return new Shape2(src);
  }

  difference(...s: Shape2[]): Shape2 {
    const src = super.difference(...s).src;
    return new Shape2(src);
  }

  intersection(...s: Shape2[]): Shape2 {
    const src = super.intersection(...s).src;
    return new Shape2(src);
  }

  scale(p: Vec3): Shape2 & Vec3 {
    const src = super.scale(p).src;
    return shape2(src, p);
  }

  translate(p: Vec3): Shape2 & Vec3 {
    const src = super.translate(p).src;
    return shape2(src, p);
  };

  rotate(p: Vec3): Shape2 & Vec3 {
    const src = super.rotate(p).src;
    return shape2(src, p);
  };

  mirror(p: Vec3): Shape2 & Vec3 {
    const src = super.mirror(p).src;
    return shape2(src, p);
  };

  color(p: string) {
    const src = super.color(p).src;
    return new Shape2(src);
  };

  tile(p: TileProps): Shape2 & TileProps {
    const src = super.tile(p).src;
    return shape2(src, p);
  }
  tile_circular(p: TileCircularProps): Shape2 & TileCircularProps {
    const src = super.tile_circular(p).src;
    return shape2(src, p);
  }
  offset(p: OffsetProps): Shape2 & OffsetProps {
    return shape2([`offset(${serialize(p)})`, ...this.src.map(indent)], p);
  }
}