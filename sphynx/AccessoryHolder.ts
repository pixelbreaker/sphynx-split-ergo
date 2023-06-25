import { Vec2, Vec3 } from "../src/csg/base";
import { polyRound } from "../src/csg/polyround";
import { cylinder, sector, sphere } from "../src/csg/primitives";
import {
  buildParameters,
  defaultOptions,
  Options,
  Parameters,
} from "./options";

export class AccessoryHolder {
  readonly height = 16;
  readonly outer = 50;
  readonly inner = 46.5;
  readonly hole = 43.9;
  readonly holeDepth = 2;

  constructor() {}

  innerCutaway() {
    return cylinder({ d: this.inner, h: this.height + 3, $fn: 90 }, false);
  }

  bodyCutaway() {
    return cylinder({ d: this.outer, h: 100, $fn: 90 }, true);
  }

  outline() {
    return cylinder(
      {
        d: this.outer,
        h: this.height,
        $fn: 90,
      },
      false
    );
  }

  sectorBody() {
    return cylinder(
      {
        d: this.outer,
        h: 50,
        sector: 207,
        $fn: 90,
      },
      false
    )
      .difference(
        cylinder({ d: this.inner, h: 53, $fn: 90 }, false).translate([0, 0, -1])
      )
      .translate([0, 0, -this.height - 22])
      .rotate([0, 0, 200]);
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
      .rotate_extrude({ angle: 360, $fn: 90 })
      .rotate([180, 0, 0]);
  }

  main() {
    return this.topRim().union(this.sectorBody());
  }
}

const holder = new AccessoryHolder();
export const main = holder.main();
