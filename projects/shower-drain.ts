

import { union } from '../src/csg/base';
import { cube, cylinder } from '../src/csg/primitives';
import { hexTile, ring } from './utils';

const options = {
  rimDiameter: 68,
  drainDiameter: 33,
  meshSize: 8,
  thickness: 1.5
}
type Option = typeof options;
const showerDrain = ({ rimDiameter, drainDiameter, meshSize, thickness }: Option) => {

  const ringOuter = ring({
    od: rimDiameter,
    id: rimDiameter - thickness * 2,
    h: thickness * 2,
    radius: [0, 1, 0, 0],
    $fn: 50
  });

  const hexMesh = cylinder({ d: rimDiameter - thickness * 1.9, h: thickness })
    .difference(
      hexTile({
        hexSize: meshSize,
        spacing: thickness / 2,
        minHeight: rimDiameter,
        minWidth: rimDiameter,
        thickness: thickness + 1,
        centerXY: true
      }).translate([0, 0, -0.5]));
  const drainInnerDiameter = drainDiameter - thickness * 2;
  const braceLen = (rimDiameter - drainDiameter) / 2 + thickness / 2;
  const crossbrace = cube([braceLen, thickness, thickness])
    .translate([drainInnerDiameter / 2, - thickness / 2, thickness])
    .rotate([0, 0, 15]); // offset a bit so that the bars don't end on center of hex

  const ringInner = ring({
    od: drainDiameter,
    id: drainInnerDiameter,
    h: thickness * 2
  }).translate([0, 0, thickness * 1.8]);

  return union(
    ringOuter,
    hexMesh,
    crossbrace.tile_circular({ times: 12 }),
    ringInner
  );
}

export const main = showerDrain(options);