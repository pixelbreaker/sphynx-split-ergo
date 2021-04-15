import { union, difference, intersection, Vec3, Vec2 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";
import { m5, m5_countersunk, inf } from "./hardware";


export const rod_offset = 12;
export const rod_depth = 40;

const rod_hole = cylinder({ d: 8, h: inf, center: true })
  .translate([rod_offset, rod_depth, 0]);

export const base_size: Vec3 = [62, 62, 4];
const base_offset = 20;
export const base = polyRound({
  points: getRectPoints({ size: [base_size[0], base_size[1]] }),
  radii: [0, 10, 30, 10],
}).extrude({ height: base_size[2], $fn: 30 })
  .translate([-base_offset, -base_offset, 0])
  .difference(
    // t-slot screws
    m5.translate([-10, -10, base_size[2] - 3]),
    m5.translate([32, -10, base_size[2] - 3]),
    m5.translate([-10, 32, base_size[2] - 3]),
  );


const side_size: Vec3 = [base_size[0] - base_offset, 50, 3];
const side = polyRound({
  points: getRectPoints({ size: [side_size[0], side_size[1]] }),
  radii: [0, 0, side_size[0], 0],
}).extrude({
  height: side_size[2], $fn: 30
}).difference(
  m5_countersunk.translate([30, 10, 0.5]),
  rod_hole
).translate([0, base_size[2], 0])
  .rotate([90, 0, 90]);


const rounding_box = polyRound({
  points: getRectPoints({ size: [inf, inf] }),
  radii: [3, 3, 3, 3],
}).extrude({ height: inf, $fn: 10 });

export const rounded_side = rounding_box.intersection(
  side.union(
    side.mirror([-1, 1, 0])
  )
);