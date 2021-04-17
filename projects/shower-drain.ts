import { OutputSettings } from '../bin/gen-scad';
import { union } from '../src/csg/base';
import { cube, cylinder, square } from '../src/csg/primitives';
import { hexTile, ring } from './utils';

const options = {
  rimDiameter: 68,
  drainDiameter: 37,
  meshSize: 8,
  thickness: 1.5
}
type Option = typeof options;
const showerDrain = ({ rimDiameter, drainDiameter, meshSize, thickness: t }: Option) => {

  const ringOuter = ring({
    od: rimDiameter,
    id: rimDiameter - t * 2,
    h: t * 2,
    radii: [0, 0, 0, t / 2],
    $fn: 100,
    $rfn: 1
  });

  const hexMesh = cylinder({ d: rimDiameter - t * 1.8, h: t, $fn: 100 })
    .difference(
      hexTile({
        hexSize: meshSize,
        spacing: t / 2,
        minHeight: rimDiameter,
        minWidth: rimDiameter,
        thickness: t + 1,
        centerXY: true
      }).translate([0, 0, -0.5]));
  const drainInnerDiameter = drainDiameter - t * 2;
  const braceLen = (rimDiameter - drainDiameter) / 2 + t / 2;
  const braceWidth = t * 1.2;
  const chamferWidth = t - 0.2;
  const crossbrace = cube([braceLen, braceWidth, t])
    .union(square({ size: [chamferWidth, braceWidth], center: true })
      .linear_extrude({ height: t, scale: [1, 2.5] })
      .translate([chamferWidth / 2, braceWidth / 2, 0]))
    .translate([drainInnerDiameter / 2, - t / 2, t])
    .rotate([0, 0, 15]); // offset a bit so that the bars don't end on center of hex

  const ringInner = ring({
    od: drainDiameter,
    id: drainInnerDiameter,
    h: t * 3,
    $fn: 50
  }).translate([0, 0, t * 1.8]);

  return union(
    ringOuter,
    hexMesh,
    crossbrace.tile_circular({ times: 12 }),
    ringInner
  );
}

export const main = showerDrain(options);
