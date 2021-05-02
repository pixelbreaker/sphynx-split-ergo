
import { FProp, Vec2, Vec3 } from '../src/csg/base';
import { Shape2 } from '../src/csg/base2';
import { shape3, Shape3 } from '../src/csg/base3';
import { getRectPoints, polyRound } from '../src/csg/polyround';
import { cube, cylinder, Alignable, sphere, square } from '../src/csg/primitives';

const inf = 1000;
type HexTileOptions = {
  hexSize: number,
  spacing: number,
  thickness: number;
  size: Vec2;
}
export const hexTile = (p: HexTileOptions) => {
  const { hexSize, spacing, thickness, size } = p;
  const hexPlate = cylinder({ d: hexSize * 2 / Math.sqrt(3) - spacing, h: thickness, $fn: 6 })
  const height = hexSize * Math.sqrt(3);
  const rows = Math.ceil(size[0] / height / 2) * 2; // want even number 
  const cols = Math.ceil(size[1] / hexSize / 2) * 2;
  const tileHex = hexPlate
    .tile({ translation: [0, hexSize, 0], times: cols })
    .tile({ translation: [height, 0, 0], times: rows });

  const panel = tileHex.union(tileHex.translate([height / 2, hexSize / 2, 0]));

  const result = panel.translate([-(rows / 2) * height, -(cols / 2) * hexSize, 0]);

  Object.assign(result, p);
  return result as (Shape3 & Vec3 & HexTileOptions);
}
type RingOptions = {
  id: number;
  od: number;
  h: number;
  radii?: number[];
  $fn?: number;
  $rfn?: number;
}
export const ring = ({ id, od, h, radii = [0], $fn, $rfn }: RingOptions): Alignable => {
  const r1 = od / 2;
  const r2 = id / 2;
  const width = Math.abs(r1 - r2);
  const ret = polyRound({ points: getRectPoints({ size: [width, h], center: false }), radii })
    .toPolygon($rfn)
    .translate([r2, 0, 0])
    .rotate_extrude({ $fn });

  return new Alignable([od, od, h], ret.translate([0, 0, -h / 2]).src);
}

export type PolyWireProps = {
  points: Vec2[],
  radii: number[],
  t: number;
}
export const polyWire = ({ points, radii = [0], t }: PolyWireProps) => {
  const base = polyRound({ points, radii, $fn: 5 }).toPolygon();
  const wire = base.offset({ r: 0.01 }).difference(base).linear_extrude({ height: .01 , center: false});
  return sphere({ d: t, $fn: 10 }).minkowski(wire);
}

type SimpleHoleProps = {
  d: number;
  h?: number;
  invert?: boolean;
  center?: boolean;
};

type CounterSinkProps = {
  countersink: number
  depth: number
} & SimpleHoleProps;

type CounterSink2Props = {
  countersink: number
  angle: number;
} & SimpleHoleProps;

type CounterBoreProps = {
  counterbore: number
  depth: number;
} & SimpleHoleProps;

type HoleProps = SimpleHoleProps | CounterBoreProps | CounterSinkProps | CounterSink2Props;

export function hole(p: SimpleHoleProps): Shape3;
export function hole(p: CounterBoreProps): Shape3;
export function hole(p: CounterSinkProps): Shape3;
export function hole(p: CounterSink2Props): Shape3;
export function hole(p: HoleProps) {
  const height = p.h || inf;
  let hole: Shape3 = cylinder({ d: p.d, h: height })
    .translate([0, 0, height / 2]);
  if ('counterbore' in p) {
    hole = hole.union(
      cylinder({ d: p.counterbore, h: p.depth })
        .translate([0, 0, p.depth / 2]));
  } else if ('countersink' in p && 'depth' in p) {
    hole = hole.union(
      cylinder({ d1: p.countersink, d2: p.d, h: p.depth })
        .translate([0, 0, p.depth / 2]));
  } else if ('angle' in p) {
    const h = (p.countersink - p.d) / 2 / Math.tan(p.angle / 2 * Math.PI / 180);
    hole = hole.union(
      cylinder({ d1: p.countersink, d2: p.d, h })
        .translate([0, 0, h / 2]));
  }
  if (p.center) {
    hole = hole.translate([0, 0, -height / 2]);
  }
  if (!p.invert) {
    hole = hole.mirror([0, 0, 1]);
  }
  return hole;
}


export const shell = (s: Shape3, t: number, $fn = 4): Shape3 =>
  s.intersection(
    sphere({ r: t, $fn }).minkowski(
      cube([inf, inf, inf]).difference(s))
  );

const epsilon = 0.01;
export type ConvexShellProps = {
  profiles: Shape2[],
  lengths: number[]
}
export const convexTube = (props: ConvexShellProps): Shape3 & ConvexShellProps => {
  const [first, ...rest] = props.profiles;
  const sections: Shape3[] = [];
  const prev: { p: Shape3 } = {
    p: first.linear_extrude({ height: epsilon , center: false})
  };
  let h = 0;
  for (let i = 0; i < rest.length; i++) {
    h += props.lengths[i];
    const p = rest[i].linear_extrude({ height: epsilon , center: false}).translate([0, 0, h]);
    sections.push(
      prev.p.hull(p));
    prev.p = p;
  }
  const [s1, ...srest] = sections;
  return shape3(s1.union(...srest).src, props);

}
