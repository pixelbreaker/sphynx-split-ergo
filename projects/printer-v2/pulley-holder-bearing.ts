import { OutputSettings } from "../../bin/gen-scad";
import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, PolyRound, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { lmu88, pulley, inf } from "./hardware";
import { base_size } from "./xy-corner";

const size = 20;
const thickness = 4;
const cavity_size = size - thickness * 2;

const body = polyRound({
  points: getRectPoints({
    size: [size, size],
    center: true
  }),
  radii: [0, 0, 10, 10]
}).extrude({ height: size, center: true, $fn: 60 }).rotate([0, -90, 0]);

const bearing = cylinder({ d: 16.5, h: cavity_size + 3 * 2, center: true })
  .union(cylinder({ d: 6, h: inf, center: true }))
  .rotate([0, 90, 0]);

export const main = body.difference(
  cube({ size: [cavity_size, inf, inf], center: true })
    .translate([0, 0, (inf - cavity_size) / 2]),
  hole({ d: 5.5, counterbore: 10, depth: 2 })
    .translate([0, 0, -cavity_size / 2 + 0.01]),
  bearing
).set({ $fn: 60 });

export const settings: OutputSettings = {
  slicer: {
    //"brim_width": 3
  }
}
