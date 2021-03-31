import { union, difference, intersection } from "../src/csg/base";
import { polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";

export const main = polyRound({
  points: [[0, 0], [0, 10], [10, 10], [5, 5], [10, 0]],
  radii: [5, 3, 2, 3]
}).extrude({ height: 10 });
