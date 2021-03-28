
import { Shape3 } from '../src/csg/base3';
import { cylinder, polygon, square } from '../src/csg/primitives';

type HexTileOptions = {
  hexSize: number,
  spacing: number,
  thickness: number
  minWidth: number,
  minHeight: number,
  centerXY?: true
}
export const hexTile = ({ hexSize, spacing, thickness, minWidth, minHeight, centerXY }: HexTileOptions) => {
  const hexPlate = cylinder({ d: hexSize - (spacing / 2), h: thickness, $fn: 6 });
  const height = hexSize * Math.sqrt(3);
  const rows = Math.ceil(minHeight / height);
  const cols = Math.ceil(minWidth / hexSize);
  const tileHex = hexPlate
    .tile({ translation: [0, hexSize, 0], times: cols })
    .tile({ translation: [height, 0, 0], times: rows });

  const result = tileHex.union(tileHex.translate([height / 2, hexSize / 2, 0]));
  if (centerXY) {
    return result.translate([-(rows / 2) * height, -(cols / 2) * hexSize, 0]);
  } else {
    return result;
  }
}

// test
const main1 = hexTile({
  hexSize: 10,
  spacing: 2,
  thickness: 3,
  minHeight: 100,
  minWidth: 100
});

type RingOptions = {
  id: number;
  od: number;
  h: number;
}
export const ring = ({ id, od, h }: RingOptions): Shape3 => {
  const r1 = od / 2;
  const r2 = id / 2;
  const width = Math.abs(r1 - r2);
  return square([width, h]).translate([r2, 0, 0]).rotate_extrude();
}

// test
export const main = ring({ id: 2, od: 10, h: 3 });