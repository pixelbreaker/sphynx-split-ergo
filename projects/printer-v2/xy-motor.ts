import { union, difference, intersection, Vec3, Vec2 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";
import { m5_sunken, motor_holes, rod_hole, rounding_box, mount } from "./xy-corner";

const inf = 1000;

export const base_size: Vec3 = [62, 62, 4];
const base_offset = 20;

const m5_inverted = m5_sunken.mirror([0, 0, 1]);

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
  radii: [10, 10, 30, 10],
}).extrude({ height: base_size[2], $fn: 30 })
  .intersection(base_mask)
  .translate([-base_offset, -base_offset, 0])
  .difference(
    motor_holes,
    // t-slot screws
    m5_inverted.translate([-10, -10, base_size[2] - 3]),
    m5_inverted.translate([32, -10, base_size[2] - 3]),
    m5_inverted.translate([-10, 32, base_size[2] - 3]),
  );

const side_size: Vec3 = [base_size[0] - base_offset, base_size[1] - base_offset, 3];
const side = polyRound({
  points: getRectPoints({ size: [side_size[0], side_size[1]] }),
  radii: [0, 0, side_size[0], 0],
}).extrude({
  height: side_size[2], $fn: 30
}).translate([0, base_size[2], 0])
  .difference(
    m5_sunken.translate([25, 10, 2]),
    rod_hole
  ).rotate([90, 0, 90]);

const rounded_side = rounding_box.intersection(
  side.union(
    side.mirror([-1, 1, 0])
  )
);

export const main = base.union(rounded_side).set({ $fn: 60 });
