export class Vector {
  result: [number, number, number];
  constructor(v: [number, number, number]) {
    this.result = v;
  }

  minus(v: [number, number, number]) {
    const a = [undefined, undefined, undefined] as [number, number, number];
    for (let i in this.result) {
      a[i] = this.result[i] - v[i];
    }
    this.result = a;
    return this;
  }
  dot(v: [number, number, number]) {
    let sum = 0;
    for (let i in this.result) {
      sum += this.result[i] * v[i];
    }
    return sum;
  }

  add(v: [number, number, number]) {
    const a = [undefined, undefined, undefined] as [number, number, number];
    for (let i in this.result) {
      a[i] = this.result[i] + v[i];
    }
    this.result = a;
    return this;
  }
  scale(s: number) {
    const a = [undefined, undefined, undefined] as [number, number, number];
    for (let i in this.result) {
      a[i] = this.result[i] * s;
    }
    this.result = a;
    return this;
  }

  cross(v: [number, number, number]) {
    const a = [0, 0, 0] as [number, number, number];
    a[0] = this.result[1] * v[2] - this.result[2] * v[1];
    a[1] = this.result[2] * v[0] - this.result[0] * v[2];
    a[2] = this.result[0] * v[1] - this.result[1] * v[0];
    this.result = a;
    return this;
  }

  toUnitVector() {
    const mag = this.magnitude();
    return this.scale(1 / mag);
  }

  magnitude() {
    let sum = 0;
    for (let v of this.result) {
      sum += v * v;
    }
    return Math.sqrt(sum);
  }
}