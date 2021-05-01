import {  Vec3, Vec2 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { inf } from "./hardware";
import { base, rounded_side, rod_offset, base_size } from "./xy-corner";

const mount = {
  hole: 22 + 1,
  screw_spacing: 31,
  screw_depth: 1
}

const motor_holes = cylinder({ d: mount.hole, h: inf, $fn: 100 })
  .union(
    // mounting screws
    ...getRectPoints({ size: [mount.screw_spacing, mount.screw_spacing], center: true })
      .map(c => hole({ d: 3, counterbore: 6, depth: mount.screw_depth }).translate([c[0], c[1], base_size[2] + 0.01]))
  )
  .rotate([0, 0, 45])
  .translate([rod_offset, rod_offset, 0]);

export const main = base
  .difference(motor_holes)
  .union(rounded_side).set({ $fn: 60 });

