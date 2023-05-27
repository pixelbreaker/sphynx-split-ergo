import { options, parameters } from "./options";
import { init, Sphynx } from "./Sphynx";

init();

export const model = new Sphynx(
  { ...options, encoder: true, trackpad: false },
  parameters
);

export const main = model
  .buildCase(model.singleKeyhole(), true)
  .mirror([1, 0, 0]);
