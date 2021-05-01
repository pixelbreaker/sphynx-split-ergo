import { walkUpBindingElementsAndPatterns } from "typescript";
import { OutputSettings } from "../bin/gen-scad";
import { Vec3 } from "../src/csg/base";
import { getCircularPoints, getRectPoints, polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";
import { inf } from "./printer-v2/hardware";
import { hexTile, polyWire, ring } from "./utils";

const r = 10;
const z = 4;
const [f, ...rest] = getRectPoints({ size: [r * 2.1, r * 2.1] })
  .map(p => sphere({ r }).translate([p[0], p[1], -(r - z)]));

export const main = cube([6 * r, 6 * r, 6 * r])
  .translate([0, 0, 3 * r])
  .intersection(
    f.union(...rest)
  ).set({ $fn: 100 });


export const settings: OutputSettings = {
  slicer: {
  }
}

