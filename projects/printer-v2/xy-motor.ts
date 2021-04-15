import { union, difference, intersection, Vec3, Vec2 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";
import { m3_sunken, inf } from "./hardware";
import { base, rounded_side, rod_offset } from "./xy-corner";

const mount = {
  hole: 22 + 1,
  screw_spacing: 31,
  screw_depth: 3
}

const motor_holes = cylinder({ d: mount.hole, h: inf, center: true, $fn: 100 })
  .union(
    // mounting screws
    ...getRectPoints({ size: [mount.screw_spacing, mount.screw_spacing], center: true })
      .map(c => m3_sunken.translate([c[0], c[1], mount.screw_depth]))
  )
  .rotate([0, 0, 45])
  .translate([rod_offset, rod_offset, 0]);

export const main = base
  .difference(motor_holes)
  .union(rounded_side).set({ $fn: 60 });