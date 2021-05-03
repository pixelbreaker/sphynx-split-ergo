import { walkUpBindingElementsAndPatterns } from "typescript";
import { OutputSettings } from "../bin/gen-scad";
import { Vec3 } from "../src/csg/base";
import { getCircularPoints, getRectPoints, polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";
import { inf } from "./printer-v2/hardware";
import { hexTile, polyWire, ring } from "./utils";

const h = 6;
const t = 2;
const length = 30;
const marker_diameter = 17;

const loop = ring({ od: marker_diameter + t * 2, id: marker_diameter, h });
const sector = 200;

const arc = loop.intersection(
  cylinder({ d: loop.size[0], h: h, sector }).rotate([0, 0, 180])
).translate([loop.size[0] / 2, 0, 0]);

const hook = cube([t, length, h]).align([1, 1, 0]).union(arc);

export const main = hook.tile({ times: 3, translation: [0, length, 0] });
export const settings: OutputSettings = {
  slicer: {
  }
}
