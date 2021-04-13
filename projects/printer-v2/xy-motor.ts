import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";
import { motor_size, main as base_corner } from "./xy-corner";

const inf = 1000;

const mount = {
  hole: 22 + 1,
  screw_spacing: 31,
  screw_depth: 2,
  center: [motor_size / 2, motor_size / 2, 0] as Vec3
}

const m3 = cylinder({ d: 3, h: inf, center: true })
  .union(cylinder({ d: 6, h: inf }));

const mount_holes = union(
  // center hole
  cylinder({ d: mount.hole, h: inf, center: true, $fn: 100 })
    .translate(mount.center),

  // mounting screws
  ...getRectPoints({ size: [mount.screw_spacing, mount.screw_spacing], center: true })
    .map(c => m3.translate([c[0] + mount.center[0], c[1] + mount.center[1], mount.screw_depth]))
)

export const main = base_corner.difference(mount_holes);
