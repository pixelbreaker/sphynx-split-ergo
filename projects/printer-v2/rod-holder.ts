import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, square_round, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { bevel_box } from "../utils";

const inf = 100;
const base: Vec3 = [20, 40, 4];
const hole = {
  h: 10,
  id: 8,
  od: 10
};
export const main =
  bevel_box({ size: base, radius: [2], rtop: 1, center: true })
    .translate([0, 0, base[2] / 2])
    .union(cylinder({ d: hole.od, h: hole.h }))
    .difference(
      cylinder({ d: hole.id, h: inf, center: true }))
    .set({ $fn: 30 });