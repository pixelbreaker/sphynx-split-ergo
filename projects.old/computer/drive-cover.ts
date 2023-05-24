import { OutputSettings } from "../../bin/gen-scad";
import { Vec3 } from "../../src/csg/base";
import { Shape3 } from "../../src/csg/base3";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, polyhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
const t = 2;
const body_size: Vec3 = [150, 77, 43];

const slot = polyRound({
  points: getRectPoints({ size: [2, 30], center: true }),
  radii: [1, 1, 1, 1]
}).extrude({ height: 500, center: true })
  .rotate([0, 0, 15])
  .translate([0, -20, 0]);
const num_slots = 12;
const slot_size = body_size[0] / num_slots;

const body =
  polyRound({
    points: getRectPoints({ size: [body_size[0] + t * 2, body_size[1] + t], center: true }),
    radii: [1, 1, 1, 1]
  }).extrude({ height: body_size[2] + t, center: true })
    .difference(
      cube(body_size).translate([0, -t, t / 2 + 0.01]),
      cube([body_size[0], body_size[1], body_size[2] / 2])
        .translate([0, t, body_size[2] / 4 + t]),
      ...Array.from(new Array(num_slots))
        .map((_, i) => slot.translate([(i + 0.5) * slot_size - body_size[0] / 2, 0, 0]))
    )
export const main = body.set({ $fn: 60 });
export const settings: OutputSettings = {
  slicer: {
    //"brim_width": 3
  }
}
