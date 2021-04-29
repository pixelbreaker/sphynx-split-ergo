import { OutputSettings } from "../../bin/gen-scad";
import { Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, PolyRound, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { lmu88, pulley, inf } from "./hardware";

const size: Vec3 = [29, 26, 26];
const offset_z = -1;
const t = 6;
const tz = 5 + offset_z;

const roundCube = (size: Vec3, radii: number[], $fn = 60) => polyRound({
  points: getRectPoints({
    size: [size[2], size[1]],
    center: true
  }),
  radii
}).extrude({ height: size[0], center: true, $fn })
  .rotate([0, -90, 0]);

const body = cube(size)//roundCube(size, [0, 0, size[1] / 4, size[1] / 4], 1)
  .translate([0, 0, offset_z]);

const bearing = cylinder({ d: 16.5, h: size[0] - 2 })
  .union(cylinder({ d: 14, h: inf }))
  .rotate([0, 90, 0]);

const cavity = roundCube([inf, size[0] - t * 2, inf], [0, 0, 5, 5])
  .mirror([0, 0, 1])
  .rotate([0, 0, 90])
  .translate([0, 0, (inf - size[2]) / 2 + tz]);

export const main = body.difference(
  cavity,
  hole({ d: 5.5, counterbore: 10, depth: 2 + 10 })
    .translate([(size[0] - 20) / 2, 0, -size[2] / 2 + tz + 10.01]),
  bearing
).rotate([90, 0, 0]).set({ $fn: 100 });


