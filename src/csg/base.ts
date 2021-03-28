import { indent, serialize } from "./openscad-util";

export type Props = {
  $fn?: number;
  $fa?: number;
  $fs?: number;
}
export type FProp<T> = T & Props;

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

const createListFn = (name: string) =>
  <T>(...s: Shape<T>[]): Shape<T> =>
    new Shape<T>([`${name}() {`, ...s.flatMap(k => k.src).map(indent), '}']);

export const union = createListFn('union');
export const difference = createListFn('difference');
export const intersection = createListFn('intersection');
export const hull = createListFn('hull');
export const minkowski = createListFn('minkowski');

export type TileProps = {
  translation: Vec3;
  times: number;
  opposite?: boolean;
}
export class Shape<T> {
  src: string[];
  props: T;
  constructor(src: string[]) {
    this.src = src;
  }

  union(s: Shape<T>, ...rest: Shape<T>[]): Shape<T> {
    return union(this, s, ...rest);
  }

  difference(s: Shape<T>, ...rest: Shape<T>[]): Shape<T> {
    return difference<T>(this, s, ...rest);
  }

  intersection(s: Shape<T>, ...rest: Shape<T>[]): Shape<T> {
    return intersection<T>(this, s, ...rest);
  }

  scale(p: Vec3) {
    return new Shape<T>([`scale(${serialize(p)})`, ...this.src.map(indent)]);
  }

  translate(p: Vec3) {
    return new Shape<T>([`translate(${JSON.stringify(p)})`, ...this.src.map(indent)]);
  };

  rotate(p: Vec3) {
    return new Shape<T>([`rotate(${JSON.stringify(p)})`, ...this.src.map(indent)]);
  };

  mirror(p: Vec3) {
    return new Shape<T>([`mirror(${JSON.stringify(p)})`, ...this.src.map(indent)]);
  };

  color(c: string) {
    return new Shape<T>([`color("${c}")`, ...this.src.map(indent)]);
  };

  tile(t: TileProps): Shape<T> {
    const times = t.times;
    if (t.times <= 0) {
      return this;
    } else {
      return this.union(
        this.tile({ ...t, times: times - 1 })
          .translate(t.translation));
    }
  }
}