import { union, difference, intersection, Vec3, Vec2 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";
import { m5_sunken, motor_holes, rod_hole, rounding_box, mount, m5, m5_countersunk } from "./xy-corner";

const inf = 1000;
export const base_size: Vec3 = [62, 62, 4];
const base_offset = 20;

const base_mask = cube(base_size).union(
  polygon({
    points: [
      [base_offset + mount.hole, base_offset],
      [base_size[0], base_offset],
      [base_size[0], base_size[1]],
      [base_offset, base_size[1]],
      [base_offset, base_offset + mount.hole],
    ]
  }).linear_extrude({ height: inf })
);

const base = polyRound({
  points: getRectPoints({ size: [base_size[0], base_size[1]] }),
  radii: [1, 10, 30, 10],
}).extrude({ height: base_size[2], r2: 1, $fn: 30 })
  .intersection(base_mask)
  .translate([-base_offset, -base_offset, 0])
  .difference(
    motor_holes,
    // t-slot screws
    m5.translate([-10, -10, base_size[2] - 3]),
    m5.translate([32, -10, base_size[2] - 3]),
    m5.translate([-10, 32, base_size[2] - 3]),
  );

const side_size: Vec3 = [base_size[0] - base_offset, base_size[1] - base_offset, 3];
const side = polyRound({
  points: getRectPoints({ size: [side_size[0], side_size[1]] }),
  radii: [0, 0, side_size[0], 0],
}).extrude({
  height: side_size[2], $fn: 30
}).translate([0, base_size[2], 0])
  .difference(
    m5_countersunk.translate([30, 10, 0.5]),
    rod_hole
  ).rotate([90, 0, 90]);

const rounded_side = rounding_box.intersection(
  side.union(
    side.mirror([-1, 1, 0])
  )
);

export const main = base.union(rounded_side).set({ $fn: 60 });
