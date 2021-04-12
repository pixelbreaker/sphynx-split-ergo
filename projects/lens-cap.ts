import { union, difference, intersection } from "../src/csg/base";
import { polyRound } from "../src/csg/polyround";
import { circle, square, polygon, } from "../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../src/csg/primitives";
import { ring } from "./utils";

const id = 20.5;
const height = 10;
const thickness = 2;
const od = id + thickness * 2;

export const main = cylinder({ d: od, h: height })
  .difference(
    cylinder({ d: id, h: height })
      .translate([0, 0, thickness]),
    ring({
      id: od - 1,
      od: od + 1,
      h: 3,
      radii: [.5, .5],
      $rfn: 1,
      center: true
    }).translate([0, 0, height / 2])
  )
  .set({ $fn: 200 });
