import { FProp, Vec2, Vec3 } from "./base";
import { shape2, Shape2 } from "./base2";
import { shape3, Shape3 } from "./base3";
import { getRectPoints } from "./polyround";
import { serialize } from "./translation-util";

export type CirleProps = FProp<{ r: number } | { d: number }>;





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


export const sphere = (p: CirleProps) => shape3([`sphere(${serialize(p)});`], p);


export const cube = (p: Vec3) => shape3([`cube(size=${serialize(p)}, center=true);`], p);
export const cubeR = (r: number, p: Vec3) => {
  const [c1, ...corners] = getRectPoints({ size: [p[0] - r * 2, p[1] - r * 2] }).map(v => cylinder({ r, h: p[2] }).translate([v[0], v[1], 0]));
  return c1.hull(...corners);
}
export const cubeR2 = (r: number, p: Vec3) => {
  const [t1, ...rest] = getRectPoints({ size: [p[0] - r * 2, p[1] - r * 2] })
    .map(v => sphere({ r }).translate([v[0], v[1], p[2] / 2]));
  const bot = getRectPoints({ size: [p[0] - r * 2, p[1] - r * 2] })
    .map(v => sphere({ r }).translate([v[0], v[1], -p[2] / 2]));
  return t1.hull(...rest, ...bot);
}


export type CylinderProps = FProp<(
  { r: number } | { r1: number, r2: number } | { d: number } | { d1: number, d2: number }) & {
    h: number;
  }>;
export const cylinder = (p: CylinderProps) => shape3([`cylinder(center=true, ${serialize(p)});`], p);


export type PolyhedronProps = FProp<{
  points: Vec3[];
  faces: Vec3[];
  convexity: number;
}>;

export const ployhedron = (p: PolyhedronProps) => shape3([`ployhedron(${serialize(p)});`], p);
