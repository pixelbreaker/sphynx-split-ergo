import { serialize, shape2, shape3 } from "./openscad-util";

export type CirleProps = FProp<{ r: number } | { d: number }>;
export const circle = (p: CirleProps): Shape2 => {
  return shape2(`circle(${serialize(p)});`);
};

type RegularPolygonProps = { $fn: number } & CirleProps
export const regular_polygon = (p: RegularPolygonProps) => circle(p);

export type SquareProps = { size: Vec2, center?: boolean };
export const square = (p: SquareProps): Shape2 => {
  return shape2(`square(${serialize(p)});`);
};

export type PolygonProps = {
  points: Vec2[],
  convexity?: number
};
export const polygon = (p: PolygonProps): Shape2 => {
  return shape2(`polygon(${serialize(p)});`);
};

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
export const text = (p: TextProps): Shape2 => {
  return shape2(`text(${serialize(p)});`);
};


export const sphere = (p: CirleProps): Shape3 => {
  return shape3(`sphere(${serialize(p)});`);
}

type CubeProps = Vec3 | FProp<{
  size: Vec3;
  center?: boolean;
}>
export const cube = (p: CubeProps): Shape3 => {
  return shape3(`cube(${serialize(p)});`);
}

type CylinderProps = FProp<(
  { r: number } | { r1: number, r2: number } | { d: number } | { d1: number, d2: number }) & {
    h: number;
    center?: boolean;
  }>;
export const cylinder = (p: CylinderProps): Shape3 => {
  return shape3(`cylinder(${serialize(p)});`);
}

type PolyhedronProps = FProp<{
  points: Vec3[];
  faces: Vec3[];
  convexity: number;
}>;

export const ployhedron = (p: PolyhedronProps): Shape3 => {
  return shape3(`ployhedron(${serialize(p)});`);
}