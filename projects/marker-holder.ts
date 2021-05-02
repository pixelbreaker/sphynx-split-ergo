import { walkUpBindingElementsAndPatterns } from "typescript";
import { OutputSettings } from "../bin/gen-scad";
import { Vec3 } from "../src/csg/base";
import { getCircularPoints, getRectPoints, polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";
import { inf } from "./printer-v2/hardware";
import { hexTile, polyWire, ring } from "./utils";

const w = 5;
const t = 2;
const marker_diameter = 19;

const loop = ring({ od: marker_diameter + t * 2, id: marker_diameter, h: w });
const sector = 200;

const hook = loop.intersection(
  cylinder({ d: loop.size[0], h: w, sector }).rotate([0, 0, 180])
).translate([loop.size[0] / 2, 0, 0]);

const base = cube([t, 10, w]).align([1, 1, 0]).union(hook);

export const main = base;
export const settings: OutputSettings = {
  slicer: {
    "duplicate": 4
  }
}
 