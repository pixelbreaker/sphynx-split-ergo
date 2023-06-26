import { Vec2, Vec3 } from "../src/csg/base";
import { polyRound } from "../src/csg/polyround";
import { cylinder, polygon, sector, sphere } from "../src/csg/primitives";
import {
  buildParameters,
  defaultOptions,
  Options,
  Parameters,
} from "./options";

export class AccessoryHolder {
  readonly totalHeight = 27.5;
  readonly height;
  readonly outer = 51;
  readonly inner = 47;
  readonly hole = 44.2;
  readonly holeDepth = 2;
  readonly quality = 90;

  constructor() {
    this.height = this.totalHeight - 8.5;
  }

  innerCutaway() {
    return cylinder(
      { d: this.inner, h: this.height + 3, $fn: this.quality },
      false
    );
  }

  bodyCutaway() {
    return cylinder({ d: this.outer - 1, h: 100, $fn: this.quality }, true);
  }

  outline() {
    return cylinder(
      {
        d: this.outer,
        h: this.height,
        $fn: this.quality,
      },
      false
    );
  }

  shim() {
    return cylinder({
      d: this.inner - 0.4,
      h: 1,
      $fn: this.quality,
    }).difference(
      cylinder({ d: 42.2, h: 3, $fn: this.quality }).translate([0, 0, -0.5])
    );
  }

  spacerPillar() {
    const h = this.totalHeight - this.holeDepth - 1.4;
    return cylinder({
      d: this.inner - 0.4,
      h,
      sector: 35,
      $fn: this.quality,
    })
      .difference(
        cylinder({
          d1: this.inner - 10,
          d2: this.inner - 5,
          h: this.totalHeight,
          $fn: this.quality,
        }).translate([0, 0, -0.5])
      )
      .translate([0, 0, h / 2]);
  }

  spacer() {
    return this.spacerPillar().union(
      this.spacerPillar().rotate([0, 0, 120]),
      this.spacerPillar().rotate([0, 0, 240]),
      cylinder({ d: this.inner - 0.4, h: 3, $fn: this.quality })
        .difference(
          cylinder({ d: this.inner - 10, h: 4, $fn: this.quality }).translate([
            0, 0, -0.1,
          ])
        )
        .translate([0, 0, 1.5])
    );
    // .translate([0, 0, h]);
  }

  sectorBody() {
    const h = this.totalHeight - this.height + 3;
    const points: Vec2[] = [
      [this.outer / 2, 0],
      [this.inner / 2, 0],
      [this.inner / 2, h],
      [this.outer / 2, h],
    ];
    const radii: number[] = [0, 0, 0, 0];

    return polygon({ points })
      .rotate_extrude({ angle: 205, $fn: this.quality })
      .rotate([180, 0, 28])
      .translate([0, 0, h]);
  }

  topRim() {
    const points: Vec2[] = [
      [this.outer / 2, 0],
      [this.hole / 2, 0],
      [this.hole / 2, this.holeDepth],
      [this.inner / 2, this.holeDepth],

      [this.inner / 2, this.height],
      [this.outer / 2, this.height],
    ];
    const radii: number[] = [1.5, 0, 0, 0, 1, 1];

    return polyRound({ points, radii })
      .toPolygon()
      .rotate_extrude({ angle: 360, $fn: this.quality })
      .rotate([180, 0, 0])
      .translate([0, 0, this.totalHeight]);
  }

  main() {
    return this.topRim().union(this.sectorBody());
  }
}

const holder = new AccessoryHolder();
// export const main = holder.main().color("red").union(holder.spacer());
export const main = holder.spacer();
