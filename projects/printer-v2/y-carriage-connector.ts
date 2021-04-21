import { OutputSettings } from "../../bin/gen-scad";
import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, PolyRound, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { lmu88, pulley, inf } from "./hardware";
import { base_size } from "./xy-corner";

const rod_od = 12;
const rod_offset = 20;
const pulley_to_clasp = 25;
const body_size: Vec3 = [55, pulley_to_clasp + lmu88.od / 2, 13];
const pulley_offset = pulley.brim / 2 + 0.5;
const clasp_screw_distance = 18;
const gap_size = 1.5;

const holes =
  // carbon fiber rod holes
  cylinder({ d: rod_od, h: inf, center: true })
    .translate([rod_offset, 0, 0])
    .union(
      // pulley screws
      hole({ d: 3, h: 10 }).rotate([-90, 0, 0])
        .translate([pulley_offset, body_size[1] / 2 + .01, -4]),

      // clasp fastener
      hole({ d: 3, h: inf, center: true }).translate([0, -6, 0]),
      hole({ d: 3, h: inf, center: true }).translate([7, -6, 0]),
      hole({ d: 3, h: inf, center: true }).translate([14, -6, 0]),

      // gap
      cube({ size: [gap_size, inf, inf], center: true }).translate([rod_offset, inf / 2, 0]),

      // gap screws
      hole({ d: 3, h: 30, counterbore: 6, depth: 12 }).rotate([0, 90, 0])
        .translate([body_size[1] + .01, body_size[1] / 3, 0]),

    )

const body = polyRound({
  points: getRectPoints({ size: [body_size[0], body_size[1]], center: true }),
  radii: [10, 10, 10, 10],
}).extrude({ height: body_size[2], center: true, $fn: 30 })
  .difference(
    holes,
    holes.mirror([1, 0, 0])
  ).translate([0, body_size[1] / 2, 0]).difference(
    cylinder({ d: lmu88.od, h: inf, center: true })
      .rotate([0, 90, 0])
  )
  
export const main = body.set({ $fn: 60 });
export const settings: OutputSettings = {
  slicer: {
    //"brim_width": 3
  }
}
