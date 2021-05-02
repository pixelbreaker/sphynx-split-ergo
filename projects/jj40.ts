import { OutputSettings } from "../bin/gen-scad";
import { Vec3 } from "../src/csg/base";
import { getCircularPoints, getRectPoints, polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";
import { inf } from "./printer-v2/hardware";
import { hexTile, polyWire, ring } from "./utils";

const t1 = 2;
const t2 = 2;
const top = 1;
const bot = 3;
const size: Vec3 = [234, 82, 15];
const r = 2;
const body = polyRound({
  points: getRectPoints({
    size: [size[0] + t1 * 2, size[1] + t1 * 2],
    center: true
  }),
  radii: [r, r, r, r],
}).extrude({ height: size[2], $fn: 8 })

const inset = cube(size).translate([0, 0, size[2] - top]);

const cavity = cube([size[0] - t2 * 2, size[1] - t2 * 2, size[2]],
).translate([0, 0, bot]);

const usb_height = 9;
const usb = polyRound({ points: getRectPoints({ size: [12, usb_height] }), radii: [3, 3, 3, 3] })
  .extrude({ height: (t1 + t2 + 1) * 2 })
  .rotate([90, 0, 0])
  .translate([-76, size[1] / 2, (size[2] - usb_height) / 2 - 3]);

const br = cube([1, inf, 2]);
const line_breaks = br.translate([size[0] / 6, 0, 0])
  .union(br.translate([-size[0] / 6, 0, 0]));

const screw_height = 5;
const screws = [[0, 0], ...getRectPoints({ size: [190, 38], center: true })].map(p =>
  polyRound({ points: getCircularPoints({ d: 5, n: 10 }) })
    .extrude({ height: screw_height, r2: -3 }).difference(cylinder({ d: 2, h: inf }))
    .translate([p[0], p[1],
    (screw_height - size[2]) / 2 + bot - .01]));

export const main = body.difference(
  inset,
  cavity,
  usb,
  line_breaks.translate([0, 0, (br.size[2] - size[2]) / 2 + .4]),
).union(...screws).set({ $fn: 10 });


export const settings: OutputSettings = {
  slicer: {
    'fan-always-on': true,
    'brim-width': 5,
    'skirts': 0,
  }
}
