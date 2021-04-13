import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";
import { m5_sunken, pulley, pulley_holes, rod_hole, rounding_box, mount, m5, pulley_holes_coord } from "./xy-corner";
const inf = 1000;
const base_size: Vec3 = [62, 62, 4];
const extra_height = 4;

const base_offset = 20;


const base = polyRound({
  points: getRectPoints({ size: [base_size[0], base_size[1]] }),
  radii: [10, 10, 30, 10],
}).extrude({ height: base_size[2], $fn: 30, r2: 1 })
  .translate([-base_offset, -base_offset, 0])
  .union(polyRound({
    points: [
      [0, 0],
      [19, 41],
      [41, 19],
    ],
    radii: [5.5, 9, 9],
  }).extrude({ height: extra_height, $fn: 30, r2: -2 })
    .translate([0, 0, base_size[2]]))
  .difference(
    ...pulley_holes,
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
    m5.translate([25, 10, 2]),
    rod_hole
  ).rotate([90, 0, 90]);


const clearance_pulley = cylinder({ d: pulley.brim + 2, h: 12 })
  .translate([
    pulley_holes_coord[0][0],
    pulley_holes_coord[0][1],
    base_size[2] + extra_height - 1
  ]);

const rounded_side = rounding_box.intersection(
  side.union(
    side.mirror([-1, 1, 0])
  )
).difference(clearance_pulley);


export const main = base.union(rounded_side)
  .set({ $fn: 60 });
