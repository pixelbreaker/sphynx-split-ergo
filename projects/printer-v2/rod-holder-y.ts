import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";

const inf = 100;
const hole = {
  h: 10,
  id: 8,
  od: 14
};
const base: Vec3 = [35, (hole.od - hole.id) / 2, 20];

const screw = {
  size: 5,
  offset: base[0] / 2 - 5
};
const screwHole = cylinder({ d: screw.size, h: inf, center: true });


const gap = cube({ size: [1.5, inf, inf], center: true })
  .translate([0, -inf / 2, 0]);

const bevel = ring({
  id: hole.od - 1.5,
  od: hole.od + 1.5,
  h: 4,
  radii: [1, 1, 1, 1],
  center: true,
  $rfn: 1
});

export const main =
  cylinder({ d: hole.od, h: base[2] / 2, center: true }).translate([0, 0, -base[2] / 4])
    .difference(cylinder({ d: hole.id, h: inf, center: true }))
    .union(
      cube({ size: base, center: true })
        .difference(
          screwHole.rotate([90, 0, 0])
            .translate([-screw.offset, 0, 0]),
          screwHole.rotate([90, 0, 0])
            .translate([screw.offset, 0, 0])
        ).translate([0, hole.id / 2 + base[1] / 2, 0])
    ).difference(
      gap,
      bevel.translate([0, 0, -base[2] / 3])
    ).set({ $fn: 60 });