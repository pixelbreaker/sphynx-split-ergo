import { FProp, Vec2, Vec3 } from "./base";
import { Shape2 } from "./base2";
import { Shape3 } from "./base3";
import { serialize } from "./translation-util";

export type CirleProps = FProp<{ r: number } | { d: number }>;
export const circle = (p: CirleProps) =>
  new Shape2([`circle(${serialize(p)});`]);

type RegularPolygonProps = { $fn: number } & CirleProps;
export const regular_polygon = (p: RegularPolygonProps) => circle(p);

export const square = (p: Vec2) => {
  return new Shape2([`square(size=${serialize(p)}, center=true);`]);
}

export type PolygonProps = {
  points: Vec2[],
  convexity?: number
};
export const polygon = (p: PolygonProps): Shape2 =>
  new Shape2([`polygon(${serialize(p)});`]);

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
export const text = (p: TextProps) => {
  return new Shape3([`text(${serialize(p)});`]);
};

export const sphere = (p: CirleProps) => {
  return new Shape3([`sphere(${serialize(p)});`]);
}

export const cube = (p: Vec3) => {
  return new Shape3([`cube(size=${serialize(p)}, center=true);`]);
}

export type CylinderProps = FProp<(
  { r: number } | { r1: number, r2: number } | { d: number } | { d1: number, d2: number }) & {
    h: number;
  }>;
export const cylinder = (p: CylinderProps) => {
  return new Shape3([`cylinder(center=true, ${serialize(p)});`]);
}

export type PolyhedronProps = FProp<{
  points: Vec3[];
  faces: Vec3[];
  convexity: number;
}>;

export const ployhedron = (p: PolyhedronProps) => {
  return new Shape3([`ployhedron(${serialize(p)});`]);
}