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
const base = cube([t, 20, w]).union(
  ring({ od: 20, id: 15, h: w }).align([1, 0, 0])
)

export const main = cylinder({ d: 10, h: 10, sector: 40 });
export const settings: OutputSettings = {
  slicer: {
  }
}
