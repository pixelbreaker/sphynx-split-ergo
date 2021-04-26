import { OutputSettings } from "../../bin/gen-scad";
import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, PolyRound, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { lmu88, pulley, inf } from "./hardware";
import { base_size } from "./xy-corner";

const size = [26, 20, 22];
const offset_z = -1;
const t = 6;
const tz = 4 + offset_z;

const body = polyRound({
  points: getRectPoints({
    size: [size[2], size[1]],
    center: true
  }),
  radii: [0, 0, 10, 10]
}).extrude({ height: size[0], center: true, $fn: 60 })
  .rotate([0, -90, 0])
  .translate([0, 0, offset_z]);

const bearing = cylinder({ d: 16.5, h: size[0] - 2, center: true })
  .union(cylinder({ d: 10, h: inf, center: true }))
  .rotate([0, 90, 0]);

export const main = body.difference(
  cube({ size: [size[0] - t * 2, inf, inf], center: true })
    .translate([0, 0, (inf - size[2]) / 2 + tz]),
  hole({ d: 5.5, counterbore: 10, depth: 2 })
    .translate([0, 0, -size[2] / 2 + tz + 0.01]),
  bearing
).set({ $fn: 100 });


