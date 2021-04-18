import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";
import { lmu88, m5, pulley, inf, m5_sunken, m3_sunken, m3 } from "./hardware";

const rod_od = 12;
const pulley_to_clasp = 25;
const height = 51;
const body_size: Vec3 = [pulley_to_clasp, lmu88.od, height];
const pulley_offset = pulley.brim / 2 + 0.5;
const screw = m5.rotate([0, 90, 0]);
const clasp_gap_rad = 40 * (0.5 * Math.PI / 180);

const holes = cylinder({ d: rod_od, h: inf, center: true })
  .rotate([90, 0, 0])
  .translate([17, 0, 20])
  .union(
    // pulley screws
    screw.translate([body_size[0], pulley.bore, pulley_offset]),

    // clasp hole
    cylinder({ d: lmu88.od, h: inf, center: true }),
    polygon({
      points: [
        [0, 0],
        [-inf * Math.cos(clasp_gap_rad), inf * Math.sin(clasp_gap_rad)],
        [-inf * Math.cos(clasp_gap_rad), -inf * Math.sin(clasp_gap_rad)]]
    }).linear_extrude({ height: inf, center: true })
      .rotate([0, 0, 20])
  )

const body = cube({ size: body_size, center: true })
  .translate([body_size[0] / 2, 3, 0])
  .union(
    cylinder({ d: lmu88.od + 6, h: height, center: true }))
  .difference(
    holes,
    holes.mirror([0, 0, 1])
  );
export const main = body.set({ $fn: 60 });
