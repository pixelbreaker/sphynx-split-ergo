import { union } from "../src/csg/boolean";
import { cube, sphere } from "../src/csg/primitives";

export const main = union(
  sphere({ r: 10 }),
  cube([10, 10, 10])
)

console.log(main.src);