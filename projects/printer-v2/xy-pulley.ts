import {Vec3, Vec2 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { belt_thickness, clearance_pulley, pulley } from "./hardware";
import { base_size, rod_offset, base, rounded_side } from "./xy-corner";

const pulley_holes_coord: Vec2[] = [
  [0, 0],
  [pulley.od + belt_thickness, pulley.brim],
  [pulley.brim, pulley.od + belt_thickness]
].map(([x, y]) => ([x + rod_offset, y + rod_offset]) as Vec2);

const pulley_holes = pulley_holes_coord.map(c => (hole({ d: 5, center: true }).translate([...c, 0])));
const plateu_height = 4;

const plateu = polyRound({
  points: [
    [0, 0],
    [19, 41],
    [41, 19],
  ],
  radii: [5.5, 9, 9],
}).extrude({ height: 4, $fn: 30, $fn2: 10, r2: -1.5 })
  .translate([0, 0, base_size[2]]);
export const main = base.union(
  rounded_side.difference(clearance_pulley.translate([
    pulley_holes_coord[0][0],
    pulley_holes_coord[0][1],
    base_size[2] + plateu_height - 1
  ])),
  plateu
).difference(
  ...pulley_holes,
).set({ $fn: 60 });