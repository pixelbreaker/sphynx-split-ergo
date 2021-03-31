import { FProp, Vec3 } from "./base";
import { Shape2 } from "./base2";
import { Shape3 } from "./base3";
import { indent, serialize } from "./translation-util";


export type PolyProps = { radiiPoints: Vec3[], fn: number };
export const polyRound = (p: PolyProps) => new PolyRound(p);

export type PolyExtrudeProps = {
  convexity?: number,
  r1: number,
  r2: number,
  fn: number,
  length?: number,
};


export class PolyRound extends Shape2 {
  p: PolyProps;
  constructor(p: PolyProps) {
    super([`polygon(polyRound(${serialize(p.radiiPoints)},${p.fn}));`]);
    this.p = p;
  }

  linear_extrude_round(p: PolyExtrudeProps) {
    p.fn = p.fn || this.p.fn;
    return new Shape3([`polyRoundExtrude(${serialize(this.p.radiiPoints)},${serialize(p)});`]);
  }

}