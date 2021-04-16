import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";
import { lmu88, m5, pulley, inf, m5_sunken, m3_sunken, m3 } from "./hardware";

const t = 2;

const rod_od = 12.5;
const rod_offset = 17;
const pulley_to_clasp = 25;
const clasp_size = lmu88.od + t * 2;
const body_size: Vec3 = [pulley_to_clasp * 2, clasp_size, lmu88.length];
const pulley_offset = pulley.brim / 2 + 0.5;
const screw = m3.rotate([0, 90, 0]);
const body = cube({ size: body_size, center: true })
  .difference(
    cylinder({ d: rod_od, h: inf, center: true })
      .rotate([90, 0, 0])
      .translate([rod_offset, 0, 0]),
    cylinder({ d: rod_od, h: inf, center: true })
      .rotate([90, 0, 0])
      .translate([-rod_offset, 0, 0]),
    screw.translate([body_size[0] / 2, 0, pulley_offset]),
    screw.translate([body_size[0] / 2, 0, -pulley_offset])
  ).difference(
    // clasp hole
    cylinder({ d: lmu88.od, h: inf, center: true }),
    m3.rotate([90, 0, 0]).translate([0, 0, 6]),
    m3.rotate([90, 0, 0]).translate([0, 0, -6]),
  );

export const main = body.set({ $fn: 60 });