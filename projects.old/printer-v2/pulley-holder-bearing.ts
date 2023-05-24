import { OutputSettings } from "../../bin/gen-scad";
import { Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, PolyRound, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, polyhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { lmu88, pulley, inf } from "./hardware";

const size: Vec3 = [29, 26, 26];
const offset_z = -1;
const t = 6;
const tz = 5 + offset_z;

const body = cube(size)
  .translate([0, 0, offset_z]);

const bearing = cylinder({ d: 16.5, h: size[0] - 2 })
  .union(cylinder({ d: 14, h: inf }))
  .rotate([0, 90, 0]);

const cavity = cube([inf, size[0] - t * 2, inf])
  .round2D(5)
  .rotate([0, 90, 90])
  .translate([0, 0, (inf - size[2]) / 2 + tz]);

export const main = body.difference(
  cavity,
  hole({ d: 5.5, counterbore: 10, depth: 2 + 10 })
    .translate([(size[0] - 20) / 2, 0, -size[2] / 2 + tz + 10.01]),
  bearing
)
  .rotate([90, 0, 0])
  .set({ $fn: 100 });


