import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";

export const inf = 1000;
export const m5 = cylinder({ d: 5, h: inf, center: true });
export const m5_sunken = m5.union(cylinder({ d: 10, h: inf }));
export const m3 = cylinder({ d: 3, h: inf, center: true });
export const m3_sunken = m3.union(cylinder({ d: 6, h: inf }));

export const mount = {
  hole: 22 + 1,
  screw_spacing: 31,
  screw_depth: 1
}

export const motor_holes = cylinder({ d: mount.hole, h: inf, center: true, $fn: 100 }).union(
  // mounting screws
  ...getRectPoints({ size: [mount.screw_spacing, mount.screw_spacing], center: true })
    .map(c => m3_sunken.translate([c[0], c[1], mount.screw_depth]))
).rotate([0, 0, 45]).translate([mount.hole / 2, mount.hole / 2, 0]);

const pulley = {
  bore: 5,
  od: 8,
  brim: 18
}
const belt_thickness = 2;

export const pulley_holes = m5.union(
  m5.translate([pulley.od + belt_thickness, pulley.od, 0]),
  m5.translate([pulley.od, pulley.od + belt_thickness, 0]),
).translate([mount.hole / 2, mount.hole / 2, 0]);

export const rounding_box = polyRound({
  points: getRectPoints({ size: [inf, inf] }),
  radii: [3, 3, 3, 3],
}).extrude({ height: inf, $fn: 10 });

export const rod_hole = cylinder({ d: 8, h: inf, center: true })
  .translate([mount.hole / 2, 24, 0]);
