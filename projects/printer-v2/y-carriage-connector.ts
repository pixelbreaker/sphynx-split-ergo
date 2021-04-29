import { size } from "lodash";
import { OutputSettings } from "../../bin/gen-scad";
import { Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, PolyRound, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { lmu88, pulley, inf } from "./hardware";
import { base_size } from "./xy-corner";

const rod_od = 12.5;
const rod_offset = 20;
const pulley_to_clasp = 25;
const body_size: Vec3 = [56, pulley_to_clasp, 13];
const pulley_offset = pulley.brim / 2 + 0.5;
const gap_size = 1.2;
const clasp_angle = 100;
const clasp_x = (lmu88.od / 2) / Math.sin(clasp_angle / 2 * Math.PI / 180);
const clasp_y = (lmu88.od / 2) / Math.cos(clasp_angle / 2 * Math.PI / 180);
const clasp_hole = ring({ id: 20, od: 24, h: 4, center: true }).rotate([0, 90, 0])

const holes =
  // carbon fiber rod holes
  cylinder({ d: rod_od, h: inf })
    .translate([rod_offset, 3, 0])
    .union(
      // pulley screws
      hole({ d: 3.5, h: 13 }).union(
        //  nut
        cube([6, inf, 3]).translate([0, (inf - 7) / 2, -10])
      ).rotate([-90, 0, 0])
        .translate([pulley_offset, body_size[1] / 2 + .01, -4]),

      // clasp fastener
      clasp_hole.translate([0, -body_size[1] / 2, 0]),
      clasp_hole.translate([6, -body_size[1] / 2, 0]),
      clasp_hole.translate([12, -body_size[1] / 2, 0]),

      // // gap
      cube([rod_offset * 2, gap_size, inf])
        .union(cube([gap_size * 2, inf, inf])
          .translate([0, inf / 2, 0]))
        .translate([
          0, 7, 0]),

      // // gap screws
      // hole({ d: 3.5, h: 30, counterbore: 6, depth: 12 }).union(
      //   //  nut
      //   cube({ size: [6, inf, 3], center: true }).translate([0, (inf - 7) / 2, -12 - 9])
      // )
      //   .rotate([0, 90, 0])
      //   .translate([body_size[0] - 20, body_size[1] / 2 - 3.5, 0]),
    )

const body = polyRound({
  points: getRectPoints({ size: [body_size[0], body_size[1]], center: true }),
  radii: [13, 10, 10, 13],
}).extrude({ height: body_size[2], center: true, $fn: 30 })
  .difference(
    holes,
    holes.mirror([1, 0, 0])
  ).translate([0, body_size[1] / 2, 0])
  .difference(
    polyRound({
      points: [[0, clasp_x], [clasp_y * 2, -clasp_x], [-clasp_y * 2, -clasp_x]], //getRectPoints({ size: [lmu88.od, lmu88.od], center: true }),
      radii: [6, 0, 0],
    }).extrude({ height: lmu88.length * 2, center: true, $fn: 30 })
      .rotate([0, 90, 0]),
    cube([inf, lmu88.id + 1, inf]),

  )
  //.union(cylinder({ d: lmu88.od, h: lmu88.length, center: true }).rotate([0, 90, 0]).debug())
  ;
export const main = body
  .mirror([0, 0, 1])
  .set({ $fn: 60 });
export const settings: OutputSettings = {
  slicer: {
    //"brim_width": 3
  }
}
