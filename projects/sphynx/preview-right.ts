import { circle, square, polygon } from "../../src/csg/primitives";
import { cube, cylinder, sphere, polyhedron } from "../../src/csg/primitives";
import { hole } from "../utils";
import { polyRound } from "../../src/csg/polyround";
import { buildOptions, options as o, parameters as p } from "./options";
import {
  buildCase,
  singleKeyhole,
  buildPlate,
  init,
  USBHolder,
  previewKeycaps,
  previewTrackpad,
} from "./sphynx";

init();

export const main = buildCase(singleKeyhole())
  .color("SlateGray")
  .union(
    buildPlate().translate([0, 0, -o.plateThickness]).color("Silver"),
    USBHolder().color("Azure"),
    previewKeycaps(),
    previewTrackpad()
  );
