import { Shape, TileProps, Vec3 } from "./base";
import { Shape2 } from "./base2";
import { indent, serialize } from "./translation-util";

const createListFn = (name: string) =>
  (...s: Shape3[]): Shape3 =>
    new Shape3([`${name}() {`, ...s.flatMap(k => k.src).map(indent), '}']);

export const hull = createListFn('hull');
export const minkowski = createListFn('minkowski');

export class Shape3 extends Shape<{ dim: 3 }> {

  union(...shapes: Shape3[]): Shape3 {
    const [s, ...rest] = shapes;
    const src = super.union(s, ...rest).src;
    return new Shape3(src);
  }

  difference(...shapes: Shape3[]): Shape3 {
    const [s, ...rest] = shapes;
    const src = super.difference(s, ...rest).src;
    return new Shape3(src);
  }

  intersection(...shapes: Shape3[]): Shape3 {
    const [s, ...rest] = shapes;
    const src = super.intersection(s, ...rest).src;
    return new Shape3(src);
  }

  projection(p?: { cut: boolean }) {
    return new Shape2([`projection(${serialize(p)})`, ...this.src.map(indent)]);
  }

  scale(p: Vec3) {
    const src = super.scale(p).src;
    return new Shape3(src);
  }

  translate(p: Vec3) {
    const src = super.translate(p).src;
    return new Shape3(src);
  };

  rotate(p: Vec3) {
    const src = super.rotate(p).src;
    return new Shape3(src);
  };

  mirror(p: Vec3) {
    const src = super.mirror(p).src;
    return new Shape3(src);
  };

  color(p: string) {
    const src = super.color(p).src;
    return new Shape3(src);
  };

  render() {
    return new Shape3([`render()`, ...this.src.map(indent)]);
  };


  tile(p: TileProps): Shape3 {
    const src = super.tile(p).src;
    return new Shape3(src);
  }

  debug(): Shape3 {
    return new Shape3(["#", ...this.src]);
  }
}