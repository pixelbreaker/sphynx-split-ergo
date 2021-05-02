import { OutputSettings } from "../../bin/gen-scad";
import { Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, PolyRound, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { lmu88, pulley, inf } from "./hardware";
import { base_size } from "./xy-corner";

const size: Vec3 = [20, 20, 25];
const thickness = 5;

const body = cube(size);

const cavity_size = size[2] - thickness * 2;

export const main = body.difference(
  cube([size[0] - thickness * 2, inf, inf])
    .round2D(2, 'y')
    .translate([0, 0, (inf - cavity_size) / 2]),
  hole({ d: 5.5, counterbore: 10, depth: 2 + 10 })
    .translate([0, 0, -cavity_size / 2 + 10]),
  hole({ d: 4.5, h: size[0] + 0.01, counterbore: 5.5, depth: size[0] / 2, center: true })
    .rotate([0, 90, 0])
    .translate([0, 0, 5])
).rotate([90, 0, 0])
  .set({ $fn: 60 });



