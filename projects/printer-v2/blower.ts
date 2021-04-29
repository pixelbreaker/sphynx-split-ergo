import { Vec3, Vec2 } from "../../src/csg/base";
import { Shape3 } from "../../src/csg/base3";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { convexTube, ring, shell } from "../utils";
import { inf } from "./hardware";

const t = 1;
const z = [10, 0, -50];
const size: Vec2 = [40, 40];
const size_min: Vec2 = [20, 10];
const offset_y = (size[1] - size_min[1]) / 2 + 5;

const body = convexTube({
  profiles: [
    square(size),
    square([5, 5]),
    circle({ d: 10 })
  ],
  t: -1,
  lengths: [5, 10]
});


const intake = cylinder({ d: size[0] - t * 4, h: inf })
  .translate([0, 0, (inf + z[0]) / 2 - t]);
const exit_nozzle = cube([size_min[0] - t * 2, size_min[1] - t * 2, t + .01])
  .translate([0, offset_y, z[2] + t / 2])

export const main = body;
