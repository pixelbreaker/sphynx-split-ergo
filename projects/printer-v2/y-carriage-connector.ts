import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";

const inf = 1000;

const rod_od = 10;
const rod_offset = 15;
const notch_offset = 8;
const notch = polyRound({
  points: getRectPoints({ size: [10, 20], center: true }),
  radii: [2, 2, 2, 2],
}).extrude({ height: inf, center: true })
  .rotate([90, 0, 0]);
const body_size: Vec3 = [45, 20, 20];
const body = cube({ size: body_size, center: true }).difference(
  cylinder({ d: rod_od, h: inf, center: true }).rotate([90, 0, 0]).translate([rod_offset, 0, 0]),
  cylinder({ d: rod_od, h: inf, center: true }).rotate([90, 0, 0]).translate([-rod_offset, 0, 0]),
  notch.translate([0, 0, body_size[1] - notch_offset]),
  notch.translate([0, 0, -(body_size[1] - notch_offset)])
);


const t = 2;
const lmu88 = {
  od: 15,
  length: 24
}
const clasp_size = lmu88.od + t * 2;
const clasp = cylinder({ d: clasp_size, h: lmu88.length, center: true })
  .union(cube({ size: [clasp_size / 2, clasp_size, lmu88.length], center: true })
    .translate([clasp_size / 4, 0, 0]))
  .difference(
    cylinder({ d: lmu88.od, h: inf, center: true }),
    cube({ size: [inf, t, inf], center: true }).translate([-inf / 2, 0, 0])
  );

export const main = union(
  body
).set({ $fn: 60 });
