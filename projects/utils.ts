
import { FProp, minkowski, Vec3 } from '../src/csg/base';
import { Shape3 } from '../src/csg/base3';
import { polyRound } from '../src/csg/polyround';
import { cube, cylinder, sphere, square } from '../src/csg/primitives';

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
  const rows = Math.ceil(minHeight / height / 2) * 2; // want even number 
  const cols = Math.ceil(minWidth / hexSize / 2) * 2;
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

type RingOptions = {
  id: number;
  od: number;
  h: number;
  radius?: number[];
  $fn?: number;
}
export const ring = ({ id, od, h, radius, $fn }: RingOptions): Shape3 => {
  const r1 = od / 2;
  const r2 = id / 2;
  const width = Math.abs(r1 - r2);
  return polyRound({
    points: [[0, 0], [0, h], [width, h], [width, 0]],
    radius: radius || [0],
    $fn
  }).translate([r2, 0, 0]).rotate_extrude({ $fn });
}


export type BevelBoxOptions = FProp<{
  size: Vec3;
  radius: number;
  bevel: number;
  half?: boolean;
  center?: boolean;
}>
export const bevel_box = (p: BevelBoxOptions) => {
  const [x, y, z] = p.size.map(s => s - 2 * p.bevel);
  const box = square({ size: [x, y], radius: [p.radius - p.bevel], $fn: p.$fn, center: true })
    .linear_extrude({ height: z, center: true });
  let rounded = new Shape3(minkowski(box, sphere({ r: p.bevel, $fn: p.$fn })).src);
  if (p.half) {
    const bottom = rounded.projection()
      .linear_extrude({ height: p.size[2] / 2 })
      .translate([0, 0, -p.size[2] / 2]);
    rounded = rounded.union(bottom);
  }
  if (!p.center) {
    return rounded.translate(p.size.map(s => s / 2) as Vec3);
  }
  return rounded;
}


// test
export const main = bevel_box({
  size: [20, 40, 5],
  radius: 4,
  bevel: 2,
  half: true,
  $fn: 15
});
