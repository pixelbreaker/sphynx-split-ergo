

import { union } from '../src/csg/base';
import { cylinder } from '../src/csg/primitives';
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
  }).translate([0, 0, thickness]);

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
      
  return hexMesh
}

export const main = showerDrain(options);
