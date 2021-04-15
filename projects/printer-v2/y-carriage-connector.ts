import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";
import { lmu88, m5, pulley, inf } from "./hardware";

const t = 2;

const rod_od = 12.5;
const rod_offset = 15;
const notch_offset = 10;

const notch = polyRound({
  points: getRectPoints({ size: [12, 20], center: true }),
  radii: [2, 2, 2, 2],
}).extrude({ height: inf, center: true })
  .rotate([90, 0, 0]);
const body_size: Vec3 = [45, 24, 24];
const body = cube({ size: body_size, center: true }).difference(
  cylinder({ d: rod_od, h: inf, center: true }).rotate([90, 0, 0]).translate([rod_offset, 0, 0]),
  cylinder({ d: rod_od, h: inf, center: true }).rotate([90, 0, 0]).translate([-rod_offset, 0, 0]),
  notch.translate([0, 0, body_size[1] - notch_offset]),
  notch.translate([0, 0, -(body_size[1] - notch_offset)])
).translate([0, -5, 0]);

const pulley_offset = pulley.brim / 2 + 1;
const clearance_pulley = cylinder({ d: pulley.brim + 2, h: 12, center: true })
  .rotate([0, 90, 0]);

const clasp_size = lmu88.od + t * 2;
const clasp = cylinder({ d: clasp_size, h: lmu88.length, center: true })
  .union(cube({ size: [clasp_size / 2, clasp_size, lmu88.length], center: true })
    .translate([clasp_size / 4, 0, 0]))
  .difference(
    cylinder({ d: lmu88.od, h: inf, center: true }),
    cube({ size: [inf, t, inf], center: true }).translate([-inf / 2, 0, 0])
  );

export const main = union(
  body,
  clasp.translate([-(body_size[0] + clasp_size) / 2, 0, 0]),
).difference(
  clearance_pulley.translate([0, 0, pulley_offset]),
  clearance_pulley.translate([0, 0, -pulley_offset]),
  m5.rotate([0, 90, 0]).translate([inf / 2 - 10, 0, pulley_offset]),
  m5.rotate([0, 90, 0]).translate([inf / 2 - 10, 0, -pulley_offset]),
).set({ $fn: 60 });
