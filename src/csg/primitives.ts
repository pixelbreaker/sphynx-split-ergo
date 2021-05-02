import { FProp, Vec2, Vec3 } from "./base";
import { shape2, Shape2 } from "./base2";
import { shape3, Shape3 } from "./base3";
import { getRectPoints } from "./polyround";
import { serialize } from "./translation-util";

export type CirleProps = FProp<{ r: number } | { d: number }>;

export class Sizable extends Shape3 {
  size: Vec3;
  constructor(size: Vec3, src: string[]) {
    super(src);
    this.size = size;
  }
  align(v: Vec3) {
    const src = this.translate(v.map((a, i) => Math.sign(a) * this.size[i] / 2) as Vec3).src;
    return new Sizable(this.size, src);
  }
}

export class Cube extends Sizable {

  private _round(r: number | number[], s: (r: number) => Shape3, dim: 2 | 3) {
    const radii: number[] = Array.isArray(r) ? r : [r];
    const half = this.size.map(s => s / 2) as Vec3;
    const [c1, ...corners] = Array.from(new Array(Math.pow(2, dim))).map((_, i) => {
      const r = Math.max(radii[i % radii.length], 0.001);
      const p = Array.from(new Array(dim))
        .map((_, j) => (i & (1 << j)) > 0 ? half[j] - r : -half[j] + r);

      return s(r).translate(p as Vec3);
    });
    const src = c1.hull(...corners).src;
    return new Sizable(this.size, src);
  }

  round2D(r: number | number[]) {
    return this._round(r, r => cylinder({ r, h: this.size[2] }), 2);
  }

  round3D(r: number | number[]) {
    return this._round(r, r => sphere({ r }), 3);
  }
}



export const circle = (p: CirleProps) =>
  shape2([`circle(${serialize(p)});`], p);

type RegularPolygonProps = { $fn: number } & CirleProps;
export const regular_polygon = (p: RegularPolygonProps) => circle(p);

export const square = (p: Vec2) => shape2([`square(size=${serialize(p)}, center=true);`], p);


export type PolygonProps = {
  points: Vec2[],
  convexity?: number
};
export const polygon = (p: PolygonProps): Shape2 =>
  shape2([`polygon(${serialize(p)});`], p);

export type TextProps = string | {
  text: string,
  size?: number,
  font?: string,
  halign?: "left" | "center" | "right";
  valign?: "top" | "center" | "right" | "left";
  spacing?: number;
  direction?: "ltr" | "rtl" | "btt" | "ltr";
  language?: "en";
  script?: string;
  $fn?: number;
};
export const text = (p: TextProps) => shape3([`text(${serialize(p)});`], p);


export const sphere = (p: CirleProps) => {
  const size = ('d' in p) ? p.d : p.r * 2;
  return new Sizable([size, size, size], [`sphere(${serialize(p)});`]);
}

export const cube = (p: Vec3) => new Cube(p, [`cube(size=${serialize(p)}, center=true);`]);

export type CylinderProps = FProp<(
  { r: number } | { r1: number, r2: number } | { d: number } | { d1: number, d2: number }) & {
    h: number;
  }>;
export const cylinder = (p: CylinderProps) => {
  let width;
  if ('d' in p) {
    width = p.d;
  } else if ('d1' in p) {
    width = Math.max(p.d1, p.d2);
  } else if ('r' in p) {
    width = p.r * 2;
  } else if ('r1' in p) {
    width = Math.max(p.r1, p.r2) * 2;
  }
  return new Sizable([width, width, p.h], [`cylinder(center=true, ${serialize(p)});`])
}


export type PolyhedronProps = FProp<{
  points: Vec3[];
  faces: Vec3[];
  convexity: number;
}>;

export const ployhedron = (p: PolyhedronProps) => shape3([`ployhedron(${serialize(p)});`], p);
