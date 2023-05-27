import { circle, square, polygon } from "../src/csg/primitives";
import { cube, cylinder, sphere, polyhedron } from "../src/csg/primitives";
import { hole } from "./utils";
import { polyRound } from "../src/csg/polyround";
import { buildOptions, options as o, parameters as p } from "./options";
import {
  buildCase,
  singleKeyhole,
  buildPlate,
  init,
  USBHolder,
  previewKeycaps,
  previewTrackpad,
  previewEncoder,
} from "./sphynx";

init({ encoder: false, trackpad: true });

export const main = buildCase(singleKeyhole());
