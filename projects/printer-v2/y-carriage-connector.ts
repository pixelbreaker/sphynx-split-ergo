import { OutputSettings } from "../../bin/gen-scad";
import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, PolyRound, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";
import { lmu88, m5, pulley, inf, m5_sunken, m3_sunken, m3 } from "./hardware";

const rod_od = 12;
const rod_offset = 20;
const body_size: Vec3 = [55, 20, lmu88.od];
const pulley_offset = pulley.brim / 2 + 0.5;
const screw = m5.rotate([-90, 0, 0]);
const clasp_screw_distance = 18;
const gap_size = 1;

const holes =
  // carbon fiber rod holes
  cylinder({ d: rod_od, h: inf, center: true })
    .translate([rod_offset, 0, 0])
    .union(
      // pulley screws
      screw.translate([pulley_offset, 3, -2]),

      // clasp screws
      m3.rotate([90, 0, 0])
        .translate([clasp_screw_distance / 2, -body_size[1] / 2, body_size[2] / 4]),

      // gap
      cube({ size: [rod_offset * 2, gap_size, inf], center: true })
        .translate([0, -rod_od / 2 + gap_size / 2, 0])

    )

const body = polyRound({
  points: getRectPoints({ size: [body_size[0], body_size[1]], center: true }),
  radii: [10, 10, 10, 10],
}).extrude({ height: body_size[2], center: true, $fn: 30 })
  .difference(
    holes,
    holes.mirror([1, 0, 0])
  );
export const main = body.set({ $fn: 60 });
export const settings: OutputSettings = {
  slicer: {
    "brim_width": 3
  }
}
