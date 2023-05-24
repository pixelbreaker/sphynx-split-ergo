import { walkUpBindingElementsAndPatterns } from "typescript";
import { OutputSettings } from "../bin/gen-scad";
import { Vec3 } from "../src/csg/base";
import { getCircularPoints, getRectPoints, polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, polyhedron } from "../src/csg/primitives";
import { inf } from "./printer-v2/hardware";
import { hexTile, polyWire, ring } from "./utils";

const d = 20;
const z = 4;

export const main = cube([d, d, d])
  .align([0, 0, 1])
  .intersection(
    sphere({ d }).translate([0, 0, -(d / 2 - z)]));

export const settings: OutputSettings = {
  slicer: {
    'duplicate': 4
  }
}
