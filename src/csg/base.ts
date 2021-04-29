import { indent, serialize } from "./translation-util";

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

export type TileProps = {
  translation: Vec3;
  times: number;
  opposite?: boolean;
}
export type TileCircularProps = {
  times: number;
  arc?: number;
}
export class Shape<T> {
  src: string[];
  _ignore?: T; // not actually used, just making sure our instance is different in terms of T
  constructor(src: string[]) {
    this.src = src;
  }
  set(o: FProp<{}>) {
    return new Shape<T>([serialize(o) + ';', ...this.src]);
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
    if (t.times <= 1) {
      return this;
    }
    const collect: Shape<T>[] = [];
    for (let i = 1; i < times; i++) {
      collect.push(new Shape<T>(this.src)
        .translate(t.translation.map(t => t * i) as Vec3));
    }
    const [first, ...rest] = collect;
    return this.union(first, ...rest);
  }
  tile_circular(t: TileCircularProps): Shape<T> {
    const times = t.times;
    const rotation = (t.arc || 360) / times;
    if (t.times <= 1) {
      return this;
    }
    const collect: Shape<T>[] = [];
    for (let i = 1; i < times; i++) {
      collect.push(new Shape<T>(this.src)
        .rotate([0, 0, rotation * i]));
    }
    const [first, ...rest] = collect;
    return this.union(first, ...rest);
  }
}