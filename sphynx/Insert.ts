import { Vec3 } from "../src/csg/base";
import { cylinder, cube } from "../src/csg/primitives";
import {
  buildParameters,
  defaultOptions,
  Options,
  Parameters,
} from "./options";

export type InsertType =
  | "case"
  | "outer"
  | "outer-support"
  | "screwhole"
  | "foot-outer"
  | "foot-inset";

export class Insert {
  readonly settings: { o: Options; p: Parameters };
  readonly pos: Vec3;
  readonly rotateZ: number;
  readonly height: number;

  readonly quality = 35;

  static getInsert(
    o: Options,
    type: InsertType,
    pos: Vec3,
    rotateZ: number = 0,
    height: number | undefined = undefined
  ) {
    const instance = new Insert(o, pos, rotateZ, height);
    return instance.getByType(type);
  }

  constructor(
    o: Options,
    pos: Vec3,
    rotateZ: number,
    height: number | undefined = undefined
  ) {
    this.settings = { o, p: buildParameters(o) };
    this.rotateZ = rotateZ;
    this.pos = pos;
    this.height = height ?? o.insertDepth;
  }

  outer() {
    const { o } = this.settings;

    return cylinder({
      d: o.insertExternal,
      h: this.height,
      $fn: this.quality,
    })
      .union(
        cube([o.insertExternal, 20, this.height])
          .translate([0, 10, 0])
          .rotate([0, 0, 10]),
        cube([o.insertExternal, 20, this.height])
          .translate([0, 10, 0])
          .rotate([0, 0, -10])
      )
      .rotate([0, 0, this.rotateZ]);
  }

  getByType(type: InsertType) {
    const { o } = this.settings;

    let insert;
    switch (type) {
      case "case":
        insert = this.outer().difference(
          cylinder({
            d: o.insertInternal,
            h: this.height + 2,
            $fn: this.quality,
          }).translate([0, 0, -1])
        );
        break;

      case "screwhole":
        insert = cylinder(
          {
            d1: o.screwHoleCountersinkDiameter,
            d2: o.screwHoleDiameter,
            h: 2,
            $fn: this.quality,
          },
          false
        )
          .union(
            cylinder(
              {
                d: o.screwHoleDiameter,
                h: this.height + 2,
                $fn: this.quality,
              },
              false
            )
          )
          .translate([0, 0, -1]);
        break;

      case "foot-outer":
        insert = cylinder(
          { d: o.feetDiameter + 2, h: this.height, $fn: this.quality },
          false
        );
        break;

      case "foot-inset":
        insert = cylinder(
          { d: o.feetDiameter, h: this.height + 1, $fn: this.quality },
          false
        ).translate([0, 0, -1]);
        break;

      default:
      case "outer":
        insert = this.outer();
        break;
    }

    return insert.translate(this.pos);
  }
}

export const main = Insert.getInsert(defaultOptions, "case", [0, 0, 0], 0);
