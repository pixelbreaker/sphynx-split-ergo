

import { union } from '../src/csg/base';
import { cube, cylinder, square } from '../src/csg/primitives';
import { hexTile, ring } from './utils';

const options = {
  rimDiameter: 68,
  drainDiameter: 33,
  meshSize: 8,
  thickness: 1.5
}
type Option = typeof options;
const showerDrain = ({ rimDiameter, drainDiameter, meshSize, thickness: t }: Option) => {

  const ringOuter = ring({
    od: rimDiameter,
    id: rimDiameter - t * 2,
    h: t * 2,
    radii: [0, 0, 0, t],
    $fn: 100
  });

  const hexMesh = cylinder({ d: rimDiameter - t * 1.9, h: t })
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
  const crossbrace = cube([braceLen, t * 1.2, t])
    .union(square({ size: [t * .8, t], center: true })
      .linear_extrude({ height: t * .8, scale: [1, 3] })
      .translate([t / 2 - t * .1, t / 2, 0]))
    .translate([drainInnerDiameter / 2, - t / 2, t])
    .rotate([0, 0, 15]); // offset a bit so that the bars don't end on center of hex

  const ringInner = ring({
    od: drainDiameter,
    id: drainInnerDiameter,
    h: t * 2,
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
