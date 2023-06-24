import { Vec3 } from "../src/csg/base";
import { cylinder, sector, sphere } from "../src/csg/primitives";
import {
  buildParameters,
  defaultOptions,
  Options,
  Parameters,
} from "./options";

export class AccessoryHolder {
  readonly height = 15;
  readonly rounding = 3;
  readonly outer = 50;
  readonly inner = 46;
  readonly hole = 43.9;

  constructor() {}

  innerCutaway() {
    return cylinder({ d: this.inner, h: this.height + 3, $fn: 90 }, false);
  }

  bodyCutaway() {
    return cylinder({ d: this.outer - 1, h: 100, $fn: 90 }, true);
  }

  outerBody() {
    return cylinder(
      {
        d: this.outer - this.rounding,
        h: this.height - this.rounding / 2,
        $fn: 90,
      },
      false
    )
      .minkowski(sphere({ d: this.rounding, $fn: 15 }))
      .difference(this.innerCutaway().translate([0, 0, -this.rounding]))
      .translate([0, 0, -this.height]);
  }

  sectorBody() {
    return cylinder(
      {
        d: this.outer,
        h: 50,
        sector: 200,
        $fn: 90,
      },
      false
    )
      .difference(
        cylinder({ d: this.inner, h: 53, $fn: 90 }, false).translate([
          0,
          0,
          -this.rounding,
        ])
      )
      .translate([0, 0, -this.height - 25])
      .rotate([0, 0, 180]);
  }

  main() {
    return cylinder({ d: this.inner + 1, h: 2, $fn: 90 }, false)
      .difference(
        cylinder({ d: this.hole, h: 3, $fn: 90 }, false).translate([0, 0, -0.5])
      )
      .translate([0, 0, -2])
      .union(this.outerBody(), this.sectorBody());
  }
}

const holder = new AccessoryHolder();
export const main = holder.main();
