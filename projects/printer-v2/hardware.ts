import { union, difference, intersection, Vec3, Vec2 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
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
  od: 15,
  length: 18
}

export const m5 = cylinder({ d: 5, h: 20, center: true });
export const m5_sunken = m5.union(cylinder({ d: 10, h: 20 }));
export const m5_countersunk = m5.union(circle({ d: 5 })
  .linear_extrude({ height: 3, scale: [2, 2] }));
export const m3 = cylinder({ d: 3, h: 20, center: true });
export const m3_sunken = m3.union(cylinder({ d: 6, h: 20 }));

export const clearance_pulley = cylinder({ d: pulley.brim + 2, h: 12 });