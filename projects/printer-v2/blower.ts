import { union, difference, intersection, Vec3, Vec2 } from "../../src/csg/base";
import { hull } from "../../src/csg/base3";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring, shell } from "../utils";
import { inf } from "./hardware";

const t = 1;
const h = 10;
const size: Vec2 = [40, 40];
const size_min: Vec2 = [20, 10];

const base = hull(
  cube({ size: [size[0], size[1], 0.01], center: true })
    .translate([0, 0, h / 2]),

  cube({ size: [size[0], size[1], 0.01], center: true })
    .translate([0, 0, h / 2 - t]),

  cube({ size: [size_min[0], size_min[1], 0.01], center: true })
    .translate([0, (size[1] - size_min[1]) / 2, -h / 2])
);

const body = shell(base, t)
  .union(

    cube({ size: [size[0], size[1], t], center: true })
      .translate([0, 0, h / 2 + t / 2]),

    cube({ size: [size_min[0], size_min[1], h], center: true })
      .translate([0, (size[1] - size_min[1]) / 2, -h])
  );

const fan = cylinder({ d: size[0] - t * 4, h: inf, center: true })
  .translate([0, 0, inf / 2 + h / 2 - t]);

export const main = body.difference(
  fan,
  cube({ size: [size_min[0] - t * 2, size_min[1] - t * 2, h + t * 2], center: true })
    .translate([0, (size[1] - size_min[1]) / 2, -h])
).render().set({ $fn: 60 });

