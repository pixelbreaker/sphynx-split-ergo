import { Vec3, Vec2 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, polyhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { inf } from "./hardware";


export const rod_offset = 12;
export const rod_depth = 40;
const m5 = hole({ d: 5 });
const m5_countersunk = hole({ d: 5, h: 20, countersink: 10, angle: 90 });

const rod_hole = hole({ d: 8, center: true })
  .translate([rod_offset, rod_depth, 0]);

export const base_size: Vec3 = [62, 62, 4];
const base_offset = 20;
export const base = cube(base_size)
  .round2D([0, 10, 10, 30])
  .align([1, 1, 1])
  .translate([-base_offset, -base_offset, 0])
  .difference(
    // t-slot screws
    m5.translate([-10, -10, base_size[2] + .01]),
    m5.translate([32, -10, base_size[2] + .01]),
    m5.translate([-10, 32, base_size[2] + .01]),
  );

const side_size: Vec3 = [base_size[0] - base_offset, 50, 3];

const side = cube(side_size)
  .round2D([0, 0, 0, side_size[0]])
  .align([1, 1, 1])
  .difference(
    m5_countersunk.translate([30, 10, side_size[2] + 0.01]),
    rod_hole
  ).translate([0, base_size[2], 0])
  .rotate([90, 0, 90]);


const rounding_box = cube([inf, inf, inf])
  .round2D(3)
  .align([1, 1, 1]);


export const rounded_side = rounding_box.intersection(
  side.union(
    side.mirror([-1, 1, 0])
  )
);

export const main = rounded_side.union(base);
