import { union, difference, intersection } from "../src/csg/base";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";

export const main = union(
  sphere({ r: 10 }).translate([10, 0, 0]),
  cube([10, 12, 15]),
  cylinder({ h: 12, r: 6 })

);
console.log(main.src);