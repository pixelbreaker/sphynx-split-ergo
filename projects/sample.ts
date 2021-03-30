import { union, difference, intersection } from "../src/csg/base";
import { polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";


export const main = polyRound({
  points: [[0, 0], [0, 10], [10, 10], [5, 5], [10, 0]],
  radius: [5, 2, 0.5, 0.5, .2],
  $fn: 30
}).linear_extrude({ height: 10 });


