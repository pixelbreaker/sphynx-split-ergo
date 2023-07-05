import { defaultOptions } from "./options";
import { model } from "./case";

export const main = model
  .buildCase(model.singleKeyhole())
  .color("#DDDDDD")
  .union(
    ...[
      model
        .buildPlate()
        .translate([0, 0, -defaultOptions.plateThickness])
        .color("#333333"),
      model.USBHolder().color("#338833"),
      model.preview(),
    ]
  );
