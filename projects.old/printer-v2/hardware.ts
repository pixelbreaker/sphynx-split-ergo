import { Vec3, Vec2 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, polyhedron } from "../../src/csg/primitives";
import { ring } from "../utils";

export const inf = 1000;
export const belt_thickness = 2;
export const pulley = {
  bore: 5,
  od: 8,
  brim: 18
}
export const steel_rod = 8;
export const carbon_fiber_rod = 12;
export const lmu88 = {
  id: 8,
  od: 15,
  length: 24.2
}

export const clearance_pulley = cylinder({ d: pulley.brim + 2, h: 12 });

