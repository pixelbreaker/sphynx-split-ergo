import { Vec3, Vec2 } from "../../src/csg/base";
import { Shape3 } from "../../src/csg/base3";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring, shell } from "../utils";
import { inf } from "./hardware";

const t = 1;
const z = [10, 0, -50];
const size: Vec2 = [40, 40];
const size_min: Vec2 = [20, 10];
const offset_y = (size[1] - size_min[1]) / 2 + 5;

const base = cube({ size: [size[0], size[1], z[0] / 2], center: true })
  .translate([0, 0, z[0] / 4])
  .union(
    Shape3.prototype.hull(
      cube({ size: [size[0], size_min[1], 0.01], center: true })
        .translate([0, (size[1] - size_min[1]) / 2, 0]),
      cube({ size: [size_min[0], size_min[1], 0.01], center: true })
        .translate([0, offset_y, z[2]])
    )
  );

const body = shell(base, t)
  .union(
    cube({ size: [size[0], size[1], t], center: true })
      .translate([0, 0, (z[0] + t) / 2]),
  );

const intake = cylinder({ d: size[0] - t * 4, h: inf, center: true })
  .translate([0, 0, (inf + z[0]) / 2 - t]);
const exit_nozzle = cube({ size: [size_min[0] - t * 2, size_min[1] - t * 2, t + .01], center: true })
  .translate([0, offset_y, z[2] + t / 2])

export const main = body.difference(
  intake,
  exit_nozzle
).render().set({ $fn: 60 });
