
import { polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, polyhedron } from "../src/csg/primitives";
import { hole } from "./utils";

export const main = cube([10, 20, 30])
  .round2D(2, 'x')
  .set({ $fa: 3, $fs: 0.4 });
