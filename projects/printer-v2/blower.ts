import { OutputSettings } from "../../bin/gen-scad";
import { Vec3, Vec2 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { convexTube, hole, ring, shell } from "../utils";
import { inf } from "./hardware";

const t = 2;
const size: Vec2 = [40 + t * 2, 40 + t * 2];
const size_min: Vec2 = [20, 10];
const offset = [10, (size[1] - size_min[1]) / 2];
const slant = 5

const base = convexTube({
  profiles: [
    square(size),
    square(size),
    square([size[0], size_min[1]]).translate([0, offset[1], 0]),
    square(size_min).translate([offset[0], offset[1] + slant, 0])
  ],
  lengths: [30, 0, 40]
});
const total_height = base.lengths.reduce((a: number, v: number) => a + v, 0);

const body = shell(base, t);
const intake = cylinder({ d: size[0] - t * 4, h: t });
const screws = getRectPoints({ size: [32, 32], center: true })
  .map(p => hole({ d: 3, h: t + 0.1, invert: true }).translate([p[0], p[1], 0]));
const exit_nozzle = cube([size_min[0] - t, size_min[1] - t, t + .02]);
const drop_in = cube([size[0] - t * 2, t * 2, 20]);
const slot = cylinder({ d: 5, h: inf }).translate([0, 5, 0]).hull(
  cylinder({ d: 5, h: inf }).translate([0, -10, 0])
);

export const main = body.difference(
  intake.translate([0, 0, intake.h / 2]),
  ...screws,
  exit_nozzle.translate([offset[0], offset[1] + slant, total_height - t / 2]),
  drop_in.translate([0, -size[1] / 2 + drop_in[1] / 2 - 0.01, drop_in[2] / 2 + t]),
)
  //.intersection(cube([inf, inf, inf]).translate([0, inf / 2, 0]))
  .render()
  .set({ $fn: 60 });

export const settings: OutputSettings = {
  slicer: {
    'cut': base.lengths[0] - t
  }
}