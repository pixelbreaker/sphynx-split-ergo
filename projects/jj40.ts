import { union, difference, intersection, Vec3 } from "../src/csg/base";
import { getRectPoints, polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";
import { inf } from "./printer-v2/hardware";
import { polyWire, ring } from "./utils";

const t1 = 3;
const t2 = 1;
const size: Vec3 = [233, 81, 20];
const r = 2;

const body = polyRound({
  points: getRectPoints({
    size: [size[0] + t1 * 2, size[1] + t1 * 2],
    center: true
  }),
  radii: [r, r, r, r]
}).extrude({ height: size[2], center: true, r2: r, $fn: 10 })

const offset = cube({ size, center: true }).translate([0, 0, size[2] - t2]);

const cavity = cube({
  size: [size[0] - t2 * 2, size[1] - t2 * 2, size[2]],
  center: true
}).translate([0, 0, t1 + t2]);

const times = 3;
const texture_x = polyWire({
  points: getRectPoints({ size: [size[2] + 10, size[1] + t1 * 2], center: true }),
  radii: [0, 0, r, r],
  t: (t1 + t2) / 2
}).rotate([0, 90, 0]).translate([0, 0, 5]).union(
  polyWire({
    points: getRectPoints({ size: [size[2], size[1] - (t2 * 2)], center: true }),
    radii: [0, 0, r, r],
    t: (t1 + t2) / 2
  }).rotate([0, 90, 0]).translate([size[0] / (times * 2 * 2), 0, t1 + t2])
).tile({ times, translation: [size[0] / (times * 2), 0, 0] })


const texture_y = cylinder({ d: 2, h: inf, center: true })
  .rotate([0, 90, 0])
  .translate([0, 0, -size[2] / 2])
  .union(
    cylinder({ d: 2, h: inf, center: true }).translate([size[0] / 2 + t1, 0, 0]),
    cylinder({ d: 2, h: inf, center: true }).translate([-size[0] / 2 - t1, 0, 0])
  );

export const main = body.difference(
  offset,
  cavity,
  texture_x,
  texture_x.mirror([1, 0, 0]),
  texture_y
).set({ $fn: 10 });