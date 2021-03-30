import { union, difference, intersection } from "../../src/csg/base";
import { polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";

const height = 4;
const hole = 8;

export const main = square({ size: [40, 20], radius: [2], center: true })
  .linear_extrude({ height: 2 })
  .union(cylinder({ d: 10, h: height }))
  .difference(cylinder({ d: 8, h: height + 0.2 })
    .translate([0, 0, -.1]))
  .set({ $fn: 50 });

