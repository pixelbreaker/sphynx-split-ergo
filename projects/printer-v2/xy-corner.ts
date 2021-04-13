import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";

const inf = 1000;

export const  thickness: Vec3 = [3, 3, 4];
export const  base_size: Vec3 = [43, 43, 43]; // inclusive of thickness
export const motor_size = 43;
const m5 = cylinder({ d: 5, h: inf, center: true })
  .union(cylinder({ d: 10, h: inf }));

const smooth_rod = 8;

const base = polyRound({
  points: getRectPoints({ size: [base_size[0], base_size[1]] }),
  radii: [0, 0, 10, 0],
}).extrude({ height: thickness[2], $fn: 30 });

const side =
  polyRound({
    points: getRectPoints({ size: [base_size[1], base_size[2]] }),
    radii: [0, 0, 40, 0],
  }).extrude({ height: thickness[1], $fn: 30 })
    .difference(
      m5.translate([motor_size / 2 - 10, 10, 1]),
      m5.translate([motor_size / 2 + 10, 10, 1]),
      cylinder({ d: smooth_rod, h: inf, center: true })
        .translate([motor_size / 2, 20 + smooth_rod / 2 + 4, 0]))
    .rotate([90, 0, 90]);

const rounding_box = polyRound({
  points: getRectPoints({ size: [inf, inf] }),
  radii: [3, 3, 3, 3],
}).extrude({ height: inf, $fn: 10 });

const res = rounding_box.intersection(
  base.union(
    side,
    side.mirror([-1, 1, 0])
  )
);

export const main = res.set({ $fn: 60 });
