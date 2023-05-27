import { options, parameters } from "./options";
import { init, Sphynx } from "./Sphynx";

init();

export const model = new Sphynx(
  { ...options, encoder: false, trackpad: true },
  parameters
);

export const main = model.buildCase(model.singleKeyhole());
