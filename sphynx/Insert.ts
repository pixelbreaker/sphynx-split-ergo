import { Vec3 } from "../src/csg/base";
import { cylinder, cube } from "../src/csg/primitives";
import { buildParameters, Options, Parameters } from "./options";

export class Insert {
  readonly settings: { o: Options; p: Parameters };
  readonly pos: Vec3;
  readonly rotateZ: number;

  static getInsert(o: Options, pos: Vec3, rotateZ: number = 0) {
    const instance = new Insert(o, pos, rotateZ);
    return instance.insert();
  }

  constructor(o: Options, pos: Vec3, rotateZ: number) {
    this.settings = { o, p: buildParameters(o) };
    this.rotateZ = rotateZ;
    this.pos = pos;
  }

  insert() {
    const { o, p } = this.settings;

    return cylinder({ d: o.insertExternal, h: o.insertDepth, $fn: 20 })
      .union(cube([o.insertExternal, 20, o.insertDepth]).translate([0, 10, 0]))
      .rotate([0, 0, this.rotateZ])
      .translate([this.pos[0], this.pos[1], 0])
      .difference(
        cylinder({
          d: o.insertInternal,
          h: o.insertDepth + 2,
          $fn: 20,
        }).translate([this.pos[0], this.pos[1], 0])
      )

      .translate([0, 0, this.pos[2]]);
  }
}
