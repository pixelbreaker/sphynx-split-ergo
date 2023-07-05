import { defaultOptions } from "./options";
import { Tenome } from "./Tenome";

export const model = new Tenome({
  ...defaultOptions,
  accessoryHolder: false,
  columns: 6,
  rows: 4,
});

export const main = model.buildCase(model.singleKeyhole()).mirror([-1, 0, 0]);
