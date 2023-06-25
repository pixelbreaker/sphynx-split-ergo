import { defaultOptions } from "./options";
import { Sphynx } from "./Sphynx";

export const model = new Sphynx({
  ...defaultOptions,
});

export const main = model.buildCase(model.singleKeyhole());
