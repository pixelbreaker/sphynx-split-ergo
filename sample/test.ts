import { difference, union } from "../src/csg/boolean";
import { translate } from "../src/csg/manipulate";
import { cube, cylinder, sphere, square } from "../src/csg/primitives";

export const main = union(
  sphere({ r: 10 }).translate([10, 0, 0]),
  cube([10, 10, 10]),
  difference(
    cylinder({ r: 6, h: 10 }),
    cube([1, 1, 1]))
)


console.log(main.src);