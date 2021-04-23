import { OutputSettings } from "../../bin/gen-scad";
import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, PolyRound, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { lmu88, pulley, inf } from "./hardware";
import { base_size } from "./xy-corner";

const id = 12;
const offset_y = 2;
const screw_offset = 10;
const body_size: Vec3 = [30, 35, 40];
const extrusion_size: Vec3 = [20, 20, 20];


const body_offset_y = (body_size[1] - id) / 2 - offset_y;
const body =
  polyRound({
    points: getRectPoints({ size: [body_size[0], body_size[1]], center: true }),
    radii: [3, 3, 3, 3]
  })
    .extrude({ height: body_size[2], center: true })
    .translate([0, body_offset_y, 0])
    .difference(
      cylinder({ d: id, h: inf, center: true }),
      cube({ size: extrusion_size, center: true })
        .translate([0,
          (body_size[1] - extrusion_size[1]) / 2 + body_offset_y + 0.01,
          (body_size[2] - extrusion_size[2]) / 2 + 0.01]),
      hole({ d: 3, h: 20 }).translate([screw_offset, 0, body_size[2] / 2 + 0.01]),
      hole({ d: 3, h: 20 }).translate([-screw_offset, 0, body_size[2] / 2 + 0.01]),
    );
export const main = body.set({ $fn: 60 });
export const settings: OutputSettings = {
  slicer: {
    //"brim_width": 3
  }
}

