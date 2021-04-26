import { OutputSettings } from "../../bin/gen-scad";
import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, PolyRound, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { hole, ring } from "../utils";
import { lmu88, pulley, inf } from "./hardware";
import { base_size } from "./xy-corner";

export const main = square({ size: [20, 20] }).linear_extrude({ height: 4 })
  .set({ $fn: 60 });
export const settings: OutputSettings = {
  slicer: {
    //"brim_width": 3
  }
}

