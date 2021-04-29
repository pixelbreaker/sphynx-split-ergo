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

const roundCube = (size: Vec3, radii: number[], $fn = 60) => polyRound({
  points: getRectPoints({
    size: [size[2], size[1]],
    center: true
  }),
  radii
}).extrude({ height: size[0], center: true, $fn })
  .rotate([0, -90, 0]);

const body = cube({ size, center: true });

const cavity_size = size[2] - thickness * 2;
export const main = body.difference(
  roundCube([inf, size[0] - thickness * 2, inf], [0, 0, 2, 2])
    .mirror([0, 0, 1])
    .rotate([0, 0, 90])
    .translate([0, 0, (inf - cavity_size) / 2]),

  hole({ d: 5.5, counterbore: 10, depth: 2 + 10 })
    .translate([0, 0, -cavity_size / 2 + 10]),
  hole({ d: 4.5, h: size[0] + 0.01, counterbore: 5.5, depth: size[0] / 2, center: true })
    .rotate([0, 90, 0])
    .translate([0, 0, 5])
).rotate([90, 0, 0]).set({ $fn: 60 });


