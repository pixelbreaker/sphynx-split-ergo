import { serialize } from "./openscad-util";

export type CirleProps = FProp<{ r: number } | { d: number }>;
export const circle = (p: CirleProps): Shape2 => {
  return {
    src2: `circle(${serialize(p)});`
  };
};

const c = circle({ r: 5 });

type RegularPolygonProps = { $fn: number } & CirleProps
export const regular_polygon = (p: RegularPolygonProps) => circle(p);

export type SquareProps = { size: Vec2, center?: boolean };
export const square = (p: SquareProps): Shape2 => {
  return {
    src2: `square(${serialize(p)});`
  };
};

export type PolygonProps = {
  points: Vec2[],
  convexity?: number
};
export const polygon = (p: PolygonProps): Shape2 => {
  return {
    src2: `polygon(${serialize(p)});`
  };
};

/**
 * text

 */

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
  return {
    src2: `text(${serialize(p)});`
  };
};