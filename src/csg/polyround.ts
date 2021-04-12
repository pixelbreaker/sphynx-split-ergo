import { FProp, Vec2, Vec3 } from "./base";
import { Shape2 } from "./base2";
import { Shape3 } from "./base3";
import { indent, serialize } from "./translation-util";

type CirclePointsProps = ({ r: number } | { d: number }) & { n: number };
export const getCircularPoints = (o: CirclePointsProps) => {
  const r = ('r' in o) ? o.r : o.d / 2;
  return Array.from(new Array(o.n), (v, i) => {
    const angle = (i / o.n) * Math.PI * 2;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    return [x, y] as Vec2;
  });
}

type RectPointsProps = {
  size: Vec2;
  center?: boolean;
}
export const getRectPoints = (p: RectPointsProps): Vec2[] => {
  const [width, length] = p.size;
  const points: Vec2[] = [[0, 0], [0, length], [width, length], [width, 0]];
  if (p.center) {
    return points.map(([x, y]) => [x - width / 2, y - length / 2]);
  }
  return points;
}
export const getDiamondPoints = (p: RectPointsProps): Vec2[] => {
  const width = p.size[0] / 2;
  const length = p.size[1] / 2;
  const points: Vec2[] = [[0, -length], [-width, 0], [0, length], [width, 0]];
  if (!p.center) {
    return points.map(([x, y]) => [x + width, y + length]);
  }
  return points;
}


export type PolyExtrudeProps = {
  $fn?: number,
  center?: boolean,
  convexity?: number,
  r1?: number,
  r2?: number,
  height: number,
};

export type PolyProps = { points: Vec2[], radii?: number[] };
export const polyRound = (p: PolyProps) => new PolyRound(p);

export class PolyRound {
  p: PolyProps;
  constructor(p: PolyProps) {
    if (!p.radii) {
      p.radii = [];
    }
    this.p = p;
  }
  setRadius(i: number, r: number) {
    const radii = [...this.p.radii];
    const points = this.p.points.map(([x, y]) => [x, y] as Vec2);
    radii[i] = r;
    return new PolyRound({ points, radii });
  }
  translate(v: Vec2) {
    const radii = [...this.p.radii];
    const points = this.p.points.map(([x, y]) => [x + v[0], y + v[0]] as Vec2);
    return new PolyRound({ points, radii });
  }
  rotate(degrees: number) {
    const rx = Math.cos(degrees * Math.PI / 180);
    const ry = Math.sin(degrees * Math.PI / 180);
    const radii = [...this.p.radii];
    const points = this.p.points.map(([x, y]) => [x * rx, y * ry] as Vec2);
    return new PolyRound({ points, radii });
  }

  toPolygon($fn?: number) {
    const points = this.p.points.map(([x, y], i) => [x, y, this.p.radii[i] || 0]);
    const params = [serialize(points)];
    if ($fn) {
      params.push(`fn=${$fn}`);
    }
    return new Shape2([`polygon(polyRound(${params.join(',')}));`]);
  }

  extrude({ $fn, center, height, r1 = 0, r2 = 0, ...rest }: PolyExtrudeProps) {
    const fn = $fn;
    const radii = this.p.radii;
    const points = this.p.points.map(([x, y], i) => [x, y, radii[i % radii.length] || 0]);
    const params = [
      serialize(points),
      serialize({ ...rest, r1, r2 }),
      `length=${height}`,
    ];
    if (fn) {
      params.push(`fn=${fn}`);
    }
    const shape = new Shape3([`polyRoundExtrude(${params.join(',')});`]);
    if (center) {
      return shape.translate([0, 0, -height / 2]);
    }
    return shape;
  }
}



