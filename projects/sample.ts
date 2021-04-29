
import { polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";
import { hole } from "./utils";

export const main = hole({ d: 5, h: 20, counterbore: 10, depth: 5 })
  .set({ $fn: 60 })
