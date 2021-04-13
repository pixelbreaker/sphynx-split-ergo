import { union, difference, intersection, Vec3 } from "../src/csg/base";
import { getCircularPoints, getDiamondPoints, polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";

const inf = 100;
const base: Vec3 = [20, 40, 4];
const hole = {
  h: 10,
  id: 8,
  od: 10
};
export const main =
  polyRound({
    points: getDiamondPoints({ size: [base[0], base[1]], center: true }),
    radii: [2]
  }).extrude({ height: base[2], r1: 1, r2: 0, $fn: 10 })
    .union(
      polyRound({ points: getCircularPoints({ d: hole.od, n: 50 }) })
        .extrude({ height: hole.h - base[2], r1: 0, r2: -2, $fn: 10 })
        .translate([0, 0, base[2]]))
    .difference(
      cylinder({ d: hole.id, h: inf, center: true }))
    .set({ $fn: 30 });
