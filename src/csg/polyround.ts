import { FProp, Vec3 } from "./base";
import { Shape2 } from "./base2";
import { Shape3 } from "./base3";
import { indent, serialize } from "./translation-util";


export type PolyProps = { radiiPoints: Vec3[], $fn: number };
export const polyRound = (p: PolyProps) => new PolyRound(p);

export type PolyExtrudeProps = {
  convexity?: number,
  r1: number,
  r2: number,
  $fn: number,
  length?: number,
};


export class PolyRound extends Shape2 {
  p: PolyProps;
  constructor(p: PolyProps) {
    const points = p.radiiPoints.map(([x, y, r]) => [x, y, r || 0]);
    super([`polygon(polyRound(${serialize(points)},${p.$fn || '$fn'}));`]);
    this.p = p;
  }

  linear_extrude_round(p: PolyExtrudeProps) {
    const { $fn, ...rest } = p;
    const fn = $fn || this.p.$fn || '$fn';
    return new Shape3([`polyRoundExtrude(${serialize(this.p.radiiPoints)},${serialize(rest)},fn=${fn});`]);
  }

}