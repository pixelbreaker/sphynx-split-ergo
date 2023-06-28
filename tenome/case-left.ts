import { defaultOptions } from "./options";
import { Tenome } from "./Tenome";

export const model = new Tenome({
  ...defaultOptions,
});

export const main = model
  .buildCase(model.singleKeyhole(), true)
  .mirror([1, 0, 0]);
