import { Vec3, Vec2 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, cubeR, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { inf } from "./hardware";

const mount = {
  hole: 22 + 1,
  screw_spacing: 31,
  screw_depth: 0,
  size: [42, 42]
}
const t = 4;
const motor_holes = cylinder({ d: mount.hole, h: inf, $fn: 100 })
  .union(
    // mounting screws
    ...getRectPoints({ size: [mount.screw_spacing, mount.screw_spacing] })
      .map(c => hole({ d: 3, counterbore: 6, depth: mount.screw_depth })
        .translate([c[0], c[1], t / 2 + .01]))
  );
const body_offset = 20 + 5;
const body = cubeR(3, [mount.size[0], mount.size[1] + body_offset, t])
  .translate([0, -body_offset / 2, 0]);

export const main = body
  .difference(motor_holes)
  .set({ $fn: 60 });