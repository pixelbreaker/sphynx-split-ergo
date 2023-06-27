import { Vec2 } from "../src/csg/base";
import { polyRound } from "../src/csg/polyround";
import { cube, cylinder } from "../src/csg/primitives";
import { Insert } from "./Insert";
import {
  buildParameters,
  defaultOptions,
  Options,
  Parameters,
} from "./options";

export class EliteCHolder {
  readonly settings: { o: Options; p: Parameters };

  readonly boltX = 34;
  readonly boltY = 32;

  readonly insertHoleDiameter = 5.5;

  readonly cutoutH = 8.5;
  readonly cutoutW = 30;

  readonly holeOffsetV = 4;
  readonly TRSDiameter = 5.5;
  readonly USBRadius = 1.8;
  readonly USBWidth = 6.2;

  readonly caseIndent = 2.1;

  readonly plateClearance = 4;

  useForCutaway = false;

  constructor(o: Options) {
    this.settings = { o, p: buildParameters(o) };
  }

  pcb() {
    const points: Vec2[] = [
      [0, 0],
      [8.79, 0],
      [10.6, 0.935],
      [38, 0.935],
      [38, 4],
      [38, 8],
      [31, 8],
      [31, 33],
      [23.8, 32.9],
      [23.8, 50.8],
      [6, 50.8],
      [6, 36.4],
      [-4.4, 36.4],
      [-4.4, 28],
      [0, 28],
      // [0, 0],
    ];
    const radii: number[] = [2, 1, 1, 5, 3, 3, 3, 3, 2, 2, 2, 5, 5, 5];

    return polyRound({ points, radii })
      .extrude({ height: 1.6, center: false })
      .difference(
        cylinder({ d: 4.02, h: 5, $fn: 20 })
          .translate([this.boltX, 4.09, 0])
          .union(
            cylinder({ d: 4.02, h: 5, $fn: 20 }).translate([0, this.boltY, 0])
          )
      )
      .color("DarkGreen");
  }

  mcu() {
    return cube([18.3, 33.9, 1.6], false)
      .color("DarkGreen")
      .union(
        cube([2.5, 30, 2.3], false).color("Black").translate([0, 2.8, -2.3]),
        cube([2.5, 30, 2.3], false)
          .color("Black")
          .translate([18.3 - 2.5, 2.8, -2.3])
      )
      .translate([10.5, 0.7, 0])
      .union(
        cylinder({
          r: this.USBRadius,
          h: this.useForCutaway ? 9 : 5,
          $fn: 20,
        })
          .hull(
            cylinder({
              r: this.USBRadius,
              h: this.useForCutaway ? 9 : 5,
              $fn: 20,
            }).translate([this.USBWidth, 0, 0])
          )
          .color("SlateGray")
          .rotate([90, 0, 0])
          .translate([
            15.9 + this.USBRadius - 1,
            this.useForCutaway ? -1 : 2.5,
            this.USBRadius / 2 - 0.8,
          ])
      )
      .translate([0.2, -1.5, this.holeOffsetV]);
  }

  trs() {
    return cube([6.8, 12.2, 5.5], false)
      .union(
        cylinder(
          { d: this.TRSDiameter, h: this.useForCutaway ? 9 : 2, $fn: 20 },
          false
        )
          .rotate([90, 0, 0])
          .translate([6.8 / 2, 0, this.TRSDiameter / 2 - 0.5])
      )
      .color("DimGray")
      .translate([1, -1, 1.6]);
  }

  assembled() {
    this.useForCutaway = false;
    return this.pcb()
      .union(this.mcu(), this.trs())
      .translate([0, 0, this.plateClearance])
      .mirror([1, 0, 0])
      .rotate([0, 0, 180]);
  }

  cutaway() {
    this.useForCutaway = true;
    return this.pcb()
      .union(
        this.mcu(),
        this.trs(),
        cube([this.cutoutW, 20, this.cutoutH], false).translate([0, -1.5, -0.5])
      )
      .translate([0, 0, this.plateClearance])
      .mirror([1, 0, 0])
      .rotate([0, 0, 180]);
  }

  inserts() {
    const { o, p } = this.settings;

    return Insert.getInsert(
      o,
      "case",
      [this.boltX, 4.09, this.plateClearance + 1.6 + o.insertDepth / 2],
      180
    )
      .union(
        Insert.getInsert(
          o,
          "case",
          [0, this.boltY, this.plateClearance + 1.6 + o.insertDepth / 2],
          90
        )
      )
      .mirror([1, 0, 0])
      .rotate([0, 0, 180]);
  }
}

const splinky = new EliteCHolder(defaultOptions);

export const main = splinky.cutaway();
