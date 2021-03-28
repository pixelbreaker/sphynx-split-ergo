

import { union } from '../src/csg/base';
import { cube, cylinder } from '../src/csg/primitives';
import { hexTile, ring } from './utils';

const options = {
  rimDiameter: 68,
  drainDiameter: 33,
  meshSize: 8,
  thickness: 1.5
}
const showerDrain = ({ rimDiameter, drainDiameter, meshSize, thickness }: typeof options) => {

  const ringOuter = ring({
    od: rimDiameter,
    id: rimDiameter - thickness * 2,
    h: thickness * 2
  });

  const hexMesh = cylinder({ d: rimDiameter, h: thickness })
    .difference(
      hexTile({
        hexSize: meshSize,
        spacing: thickness / 2,
        minHeight: rimDiameter,
        minWidth: rimDiameter,
        thickness: thickness + 1,
        centerXY: true
      }).translate([0, 0, -0.5]));
  const drainId = drainDiameter - thickness * 2;
  const braceLen = (rimDiameter - drainDiameter) / 2 + thickness / 2;
  const crossbrace = cube([braceLen, thickness, thickness])
    .translate([drainId / 2, - thickness / 2, thickness]);

  const ringInner = ring({
    od: drainDiameter,
    id: drainId,
    h: thickness * 3
  }).translate([0, 0, thickness * 2]);

  return union(
    ringOuter,
    hexMesh,
    crossbrace.tile_circular({ times: 12 }),
    ringInner
  );
}

export const main = showerDrain(options);
