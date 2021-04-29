
import { FProp, Vec2, Vec3 } from '../src/csg/base';
import { Shape2 } from '../src/csg/base2';
import { Shape3 } from '../src/csg/base3';
import { getRectPoints, polyRound } from '../src/csg/polyround';
import { cube, cylinder, sphere, square } from '../src/csg/primitives';

const inf = 1000;
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
  radii?: number[];
  center?: boolean;
  $fn?: number;
  $rfn?: number;
}
export const ring = ({ id, od, h, radii = [0], $fn, $rfn, center }: RingOptions): Shape3 => {
  const r1 = od / 2;
  const r2 = id / 2;
  const width = Math.abs(r1 - r2);
  const ret = polyRound({ points: getRectPoints({ size: [width, h] }), radii })
    .toPolygon($rfn)
    .translate([r2, 0, 0])
    .rotate_extrude({ $fn });

  if (center) {
    return ret.translate([0, 0, -h / 2]);
  }

  return ret;
}

export type PolyWireProps = {
  points: Vec2[],
  radii: number[],
  t: number;
}
export const polyWire = ({ points, radii = [0], t }: PolyWireProps) => {
  const base = polyRound({ points, radii, $fn: 10 }).toPolygon();
  const wire = base.offset({ r: 0.01 }).difference(base).linear_extrude({ height: .01 });
  return sphere({ d: t }).minkowski(wire);
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
  let hole = cylinder({ d: p.d, h: p.h || inf });
  if ('counterbore' in p) {
    hole = hole.union(cylinder({ d: p.counterbore, h: p.depth }));
  } else if ('countersink' in p && 'depth' in p) {
    hole = hole.union(cylinder({ d1: p.countersink, d2: p.d, h: p.depth }));
  } else if ('angle' in p) {
    const h = (p.countersink - p.d) / 2 / Math.tan(p.angle / 2 * Math.PI / 180);
    hole = hole.union(cylinder({ d1: p.countersink, d2: p.d, h }));
  }
  if (p.center) {
    hole = hole.translate([0, 0, -height / 2]);
  }
  if (!p.invert) {
    hole = hole.mirror([0, 0, 1]);
  }
  return hole;
}


export const shell = (s: Shape3, t: number): Shape3 =>
  s.intersection(
    sphere({ r: t, $fn: 10 }).minkowski(
      cube( [inf, inf, inf]).difference(s))
  );

const epsilon = 0.01;
export type ConvexShellProps = {
  profiles: Shape2[],
  t: number,
  lengths: number[]
}
export const convexTube = (props: ConvexShellProps): Shape3 => {
  const [first, ...rest] = props.profiles;
  const sections: Shape3[] = [];
  const prev = {
    p: first.linear_extrude({ height: epsilon }),
    p_min: first.offset({ r: props.t })
      .linear_extrude({ height: epsilon })
  };
  let h = 0;
  for (let i = 0; i < rest.length; i++) {
    h += props.lengths[i];
    const p = rest[i].linear_extrude({ height: epsilon }).translate([0, 0, h]);
    const p_min = rest[i].offset({ r: -Math.abs(props.t) })
      .linear_extrude({ height: epsilon })
      .translate([0, 0, h]);
    sections.push(
      prev.p.hull(p)
        .difference(
          prev.p_min.translate([0, 0, -epsilon])
            .hull(p_min.translate([0, 0, epsilon]))
        ));
    prev.p = p;
    prev.p_min = p_min;
  }
  const [s1, ...srest] = sections;
  return s1.union(...srest);

}
