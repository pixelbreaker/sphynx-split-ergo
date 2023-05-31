import { Shape, TileCircularProps, TileProps, Vec3 } from "./base";
import { shape2, Shape2 } from "./base2";
import { indent, serialize } from "./translation-util";

export const shape3 = <T>(s: string[], t: T) => {
  const sh = new Shape3(s);
  Object.assign(sh, t);
  return sh as Shape3 & T;
};

export class Shape3 extends Shape {
  // 3d only functions
  projection(p?: { cut: boolean }) {
    return new Shape2([`projection(${serialize(p)})`, ...this.src.map(indent)]);
  }

  render() {
    return new Shape3([`render()`, ...this.src.map(indent)]);
  }

  // 'upgrade' common funcs
  union(...s: Shape3[]): Shape3 {
    const src = super.union(...s).src;
    return new Shape3(src);
  }

  difference(...s: Shape3[]): Shape3 {
    const src = super.difference(...s).src;
    return new Shape3(src);
  }

  intersection(...s: Shape3[]): Shape3 {
    const src = super.intersection(...s).src;
    return new Shape3(src);
  }

  minkowski(...s: Shape3[]): Shape3 {
    const src = super.minkowski(...s).src;
    return new Shape3(src);
  }

  hull(...s: Shape3[]): Shape3 {
    const src = super.hull(...s).src;
    return new Shape3(src);
  }

  scale(p: Vec3): Shape3 & Vec3 {
    const src = super.scale(p).src;
    return shape3(src, p);
  }

  translate(p: Vec3): Shape3 & Vec3 {
    const src = super.translate(p).src;
    return shape3(src, p);
  }

  rotate(p: Vec3): Shape3 & Vec3 {
    const src = super.rotate(p).src;
    return shape3(src, p);
  }

  mirror(p: Vec3): Shape3 & Vec3 {
    const src = super.mirror(p).src;
    return shape3(src, p);
  }

  color(p: string) {
    const src = super.color(p).src;
    return new Shape3(src);
  }

  tile(p: TileProps): Shape3 & TileProps {
    const src = super.tile(p).src;
    return shape3(src, p);
  }

  tile_circular(p: TileCircularProps): Shape3 & TileCircularProps {
    const src = super.tile_circular(p).src;
    return shape3(src, p);
  }

  debug() {
    this.src.unshift("#");
    return this;
  }
}
