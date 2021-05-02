import { indent, serialize } from "./translation-util";

export type Props = {
  $fn?: number;
  $fa?: number;
  $fs?: number;
}
export type FProp<T> = T & Props;

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export type TileProps = {
  translation: Vec3;
  times: number;
  both?: boolean;
}
export type TileCircularProps = {
  times: number;
  arc?: number;
}
export class Shape {
  src: string[];
  constructor(src: string[]) {
    this.src = src;
  }
  set(o: FProp<{}>) {
    return new Shape([serialize(o).replace(/\,/g, ";") + ';', ...this.src]);
  }

  union(...s: Shape[]): Shape {
    return new Shape([`union() {`, ...[this, ...s].flatMap(k => k.src).map(indent), '}']);
  }

  difference(...s: Shape[]): Shape {
    return new Shape([`difference() {`, ...[this, ...s].flatMap(k => k.src).map(indent), '}']);
  }

  intersection(...s: Shape[]): Shape {
    return new Shape([`intersection() {`, ...[this, ...s].flatMap(k => k.src).map(indent), '}']);
  }

  minkowski(...s: Shape[]): Shape {
    return new Shape([`minkowski() {`, ...[this, ...s].flatMap(k => k.src).map(indent), '}']);
  }

  hull(...s: Shape[]): Shape {
    return new Shape([`hull() {`, ...[this, ...s].flatMap(k => k.src).map(indent), '}']);
  }

  scale(p: Vec3) {
    return new Shape([`scale(${serialize(p)})`, ...this.src.map(indent)]);
  }

  translate(p: Vec3) {
    return new Shape([`translate(${JSON.stringify(p)}) {`, ...this.src.map(indent), '}']);
  };

  rotate(p: Vec3) {
    return new Shape([`rotate(${JSON.stringify(p)}) {`, ...this.src.map(indent), '}']);
  };

  mirror(p: Vec3) {
    return new Shape([`mirror(${JSON.stringify(p)}) {`, ...this.src.map(indent), '}']);
  };

  color(c: string) {
    return new Shape([`color("${c}") {`, ...this.src.map(indent), '}']);
  };

  tile(t: TileProps): Shape {
    const times = t.times;
    if (t.times <= 0) {
      return this;
    }
    const collect: Shape[] = [];
    for (let i = 1; i <= times; i++) {
      collect.push(new Shape(this.src)
        .translate(t.translation.map(t => t * i) as Vec3));
      if (t.both) {
        collect.push(new Shape(this.src)
          .translate(t.translation.map(t => -t * i) as Vec3));
      }
    }
    return this.union(...collect);
  }

  tile_circular(t: TileCircularProps): Shape {
    const times = t.times;
    const rotation = (t.arc || 360) / times;
    if (t.times <= 1) {
      return this;
    }
    const collect: Shape[] = [];
    for (let i = 1; i < times; i++) {
      collect.push(new Shape(this.src)
        .rotate([0, 0, rotation * i]));
    }
    return this.union(...collect);
  }
}