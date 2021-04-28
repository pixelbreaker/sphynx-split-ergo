import { union, difference, intersection, Vec3 } from "../src/csg/base";
import { getRectPoints, polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";
import { ring } from "./utils";

const t1 = 3;
const t2 = 1;
const size: Vec3 = [233, 81, 20];

const body = polyRound({
  points: getRectPoints({
    size: [size[0] + t1 * 2, size[1] + t1 * 2],
    center: true
  }),
  radii: [2, 2, 2, 2]
}).extrude({ height: size[2], center: true, r2: 2 })

const offset = cube({ size, center: true }).translate([0, 0, size[2] - t2]);

const cavity = cube({
  size: [size[0] - t2 * 2, size[1] - t2 * 2, size[2]],
  center: true
}).translate([0, 0, t1]);

export const main = body.difference(
  offset,
  cavity
).set({ $fn: 200 });
