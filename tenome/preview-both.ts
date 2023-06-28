import { main as left } from "./preview-left";
import { main as right } from "./preview-right";

export const main = left
  .translate([-100, 0, 0])
  .union(right.translate([100, 0, 0]));
