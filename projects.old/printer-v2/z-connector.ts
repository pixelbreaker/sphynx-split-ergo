import { OutputSettings } from "../../bin/gen-scad";
import { Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, polyhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { lmu88, pulley, inf } from "./hardware";
import { base_size } from "./xy-corner";

const id = 15.5;
const offset_y = 2;
const screw_offset = 12;
const body_size: Vec3 = [30, 30, 40];
const extrusion_size: Vec3 = [20, body_size[1] - (id + offset_y * 2), 20];

const body_offset_y = (body_size[1] - id) / 2 - offset_y;
const body = cube(body_size).round2D(3)
    .translate([0, body_offset_y, 0])
    .difference(
      cylinder({ d: id, h: inf }),
      cube(extrusion_size)
        .translate([0,
          (body_size[1] - extrusion_size[1]) / 2 + body_offset_y + 0.01,
          (body_size[2] - extrusion_size[2]) / 2 + 0.01]),
      hole({ d: 3, h: 20 }).translate([screw_offset, 0, body_size[2] / 2 + 0.01]),
      hole({ d: 3, h: 20 }).translate([-screw_offset, 0, body_size[2] / 2 + 0.01])
    );
export const main = body.set({ $fa: 3, $fs: 0.4 });
export const settings: OutputSettings = {
  slicer: {
    //"brim_width": 3
  }
}
