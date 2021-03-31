import { union, difference, intersection } from "../src/csg/base";
import { polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";

export const main = polyRound({
  radiiPoints: [[0, 0, 5], [0, 10, 2], [10, 10, 0.5], [5, 5, .2], [10, 0, 2]],
  $fn: 30
}).linear_extrude({ height: 10 });
