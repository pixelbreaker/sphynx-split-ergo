import { union, difference, intersection } from "../src/csg/base";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";

export const main = union(
  sphere({ r: 10 }).translate([10, 0, 0]),

  cube([10, 10, 10])
    .difference(
      cylinder({ r: 6, h: 10 }),

  cube([1, 1, 1])),

  square([10, 5])
    .linear_extrude({ height: 10 })
    .scale([10, 10, 10]),

);

console.log(main.src);