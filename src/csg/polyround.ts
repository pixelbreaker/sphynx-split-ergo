import { Vector } from "../math";
import { FProp, Vec2, Vec3 } from "./base";
import { Shape2 } from "./base2";
import { circle, CirleProps, polygon } from "./primitives";

const epsilon = 0.0001;
export type PolyProps = FProp<{ points: Vec2[], radius: number[] }>;
export const polyRound = (p: PolyProps): Shape2 => {

  let poly = polygon({ points: p.points });

  const len = p.points.length;
  for (let i = 0; i < len; i++) {
    const rad = p.radius[i % p.radius.length];
    if (!rad || rad < epsilon) {
      continue;
    }

    const curr = p.points[i];
    const prev = p.points[(i + len - 1) % len];
    const next = p.points[(i + 1) % len];

    const c = [curr[0], curr[1], 0] as Vec3;
    const a = new Vector([prev[0], prev[1], 0]).minus(c).toUnitVector().result;
    const b = new Vector([next[0], next[1], 0]).minus(c).toUnitVector().result;

    const cross = new Vector(a).cross(b).result;
    if (Math.abs(cross[2]) < epsilon) {
      // lines are colinear, we can ignore this point all together
      continue;
    }

    const bisector = new Vector(a).add(b).toUnitVector().result;
    const normal = new Vector(cross).cross(a).toUnitVector();
    const d = rad / (new Vector(bisector).dot(normal.result));
    const dVec = new Vector(bisector).scale(d).result;
    const center = new Vector(dVec).add(c).result;
    const aVec = new Vector(a).scale(new Vector(dVec).dot(a)).result;
    const bVec = new Vector(b).scale(new Vector(dVec).dot(b)).result;
    console.log(center, rad, a, b);
    const cirProp: CirleProps = {
      r: rad
    }
    if (p.$fn) {
      cirProp.$fn = p.$fn;
    }
    const currentCorner = polygon({
      points: [
        [aVec[0] + curr[0], aVec[1] + curr[1]],
        curr,
        [bVec[0] + curr[0], bVec[1] + curr[1]]]
    });

    if (cross[2] < 0) {
      // convex --- remove material
      poly = poly
        .difference(currentCorner)  //remove the corner
        .union(circle(cirProp)   // add back rounded corner
          .translate(center)
          .intersection(currentCorner));
    } else {
      // concave --- add material
      poly = poly.union(currentCorner
        .difference(
          circle(cirProp).translate(center)));
    }
  }

  return poly;

}