import { Vec3 } from "../src/csg/base";
import { deg2rad } from "../src/math";

export type SwitchTypes = "choc" | "mx";
export type SwitchStyle = SwitchTypes;
export type SwitchSpacing = SwitchTypes;
export type KeycapStyles = "choc" | "xda" | "sa";
export type MCUHolder =
  | "elite-c"
  | "rpi-pico"
  | "pro-micro"
  | "bastardkb-holder";
export type RenderSide = "right" | "left";

export type Options = {
  caseRimDrop: number;
  caseSpacing: number;
  centerColumn: number;
  centreRow: number;
  columns: 5 | 6;
  extraHeight: number;
  extraWidth: number;
  insertDepth: number;
  insertExternal: number;
  insertInternal: number;
  keycapStyle: KeycapStyles;
  mcuHolder: MCUHolder;
  plateThickness: number;
  rows: 3 | 4;
  side: RenderSide;
  tentingAngle: number;
  thumbOffsets: Vec3;
  webThickness: number;
  zOffset: number;
  // trackpad: boolean;
  // encoder: boolean;
} & ( // Discriminated union to disable encoder when trackpad is enabled
  | { trackpad: true; encoder: false }
  | { trackpad: false; encoder: boolean }
) & // Discriminated union to ensure mx switches have mx spacing only
  (
    | {
        switchStyle: Extract<SwitchStyle, "mx">;
        switchSpacing: Extract<SwitchSpacing, "mx">;
      }
    | {
        switchStyle: Extract<SwitchStyle, "choc">;
        switchSpacing: SwitchSpacing;
      }
  );

export type Parameters = {
  centreRow: number;
  curveColumn: number;
  curveRow: number;
  deltaColumnX: number;
  keycapHeight: number;
  keyholeHeight?: number;
  keyholeThickness: number;
  keyholeWidth?: number;
  keyTopHeight: number;
  mountHeight?: number;
  mountWidth?: number;
  radiusColumn: number;
  radiusRow: number;
};

export const defaultOptions: Options = {
  caseRimDrop: 1,
  caseSpacing: 2,
  centerColumn: 2.5,
  centreRow: 1.5,
  columns: 5,
  encoder: false,
  extraHeight: 0,
  extraWidth: 1.4,
  insertDepth: 4,
  insertExternal: 10,
  insertInternal: 5.4,
  keycapStyle: "choc",
  mcuHolder: "elite-c",
  plateThickness: 2,
  rows: 3,
  side: "right",
  switchSpacing: "choc",
  switchStyle: "choc",
  tentingAngle: 14,
  thumbOffsets: [8, -1, -3],
  trackpad: false,
  webThickness: 2,
  zOffset: 10,
};

export const buildOptions = (
  userOptions: Partial<Options> = defaultOptions
) => {
  const options = { ...defaultOptions, ...userOptions } as Options;
  return { options, parameters: buildParameters(options) };
};

export const buildParameters = (
  o: Required<Options>,
  overrides: Partial<Parameters> = {}
) => {
  const keyholeWidth = o.switchStyle === "choc" ? 13.8 : 13.95;
  const keyholeHeight = keyholeWidth;
  const mountWidth = keyholeWidth + (o.switchSpacing === "choc" ? 3.2 : 4);
  const mountHeight = mountWidth;
  const keycapHeight = o.keycapStyle === "choc" ? 9 : 13;
  const keyTopHeight = o.webThickness + keycapHeight;
  const curveColumn = 13;
  const curveRow = 4;
  const radiusRow =
    keyTopHeight +
    (mountHeight + o.extraHeight) / 2 / Math.sin(deg2rad(curveColumn) / 2);
  const radiusColumn =
    keyTopHeight +
    (mountWidth + o.extraWidth) / 2 / Math.sin(deg2rad(curveRow) / 2);
  const deltaColumnX = -1 + -(radiusColumn * Math.sin(deg2rad(curveRow)));
  const centreRow = o.rows - o.centreRow;
  const keyholeThickness = o.switchStyle === "choc" ? 2 : 4;

  return {
    centreRow,
    curveColumn,
    curveRow,
    deltaColumnX,
    keycapHeight,
    keyholeHeight,
    keyholeThickness,
    keyholeWidth,
    keyTopHeight,
    mountHeight,
    mountWidth,
    radiusColumn,
    radiusRow,
    ...overrides,
  };
};
