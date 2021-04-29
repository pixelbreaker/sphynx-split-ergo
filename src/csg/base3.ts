import { Shape, TileCircularProps, TileProps, Vec3 } from "./base";
import { Shape2 } from "./base2";
import { indent, serialize } from "./translation-util";

export class Shape3 extends Shape {

  // 3d only functions
  projection(p?: { cut: boolean }) {
    return new Shape2([`projection(${serialize(p)})`, ...this.src.map(indent)]);
  }
  
  render() {
    return new Shape3([`render()`, ...this.src.map(indent)]);
  };

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

  tile(p: TileProps): Shape3 {
    const src = super.tile(p).src;
    return new Shape3(src);
  }

  tile_circular(p: TileCircularProps): Shape3 {
    const src = super.tile_circular(p).src;
    return new Shape3(src);
  }

  debug(): Shape3 {
    return new Shape3(["#", ...this.src]);
  }
}