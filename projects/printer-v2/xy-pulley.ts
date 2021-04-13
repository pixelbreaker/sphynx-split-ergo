import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";
import { motor_size, main as base_corner } from "./xy-corner";

const inf = 1000;
const m5 = cylinder({ d: 5, h: inf, center: true });
const center = motor_size / 2;
const pulley = {
  bore: 5,
  od: 8,
  brim: 18
}
const offset = center + pulley.od + 2;
export const main = base_corner.difference(
  m5.translate([center, center - pulley.od, 0]),
  m5.translate([center - pulley.od, center, 0]),
  m5.translate([offset, offset, 0]),
);