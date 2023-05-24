import { Vec3 } from "./csg/base";
import { deg2rad } from "./math";

type SwitchTypes = "choc" | "mx";
type SwitchStyle = SwitchTypes;
type SwitchSpacing = SwitchTypes;
type KeycapStyles = "choc" | "xda" | "sa";
type MCUHolder = "elite-c" | "rpi-pico" | "pro-micro" | "splinky";
type RenderSide = "right" | "left";

export type Options = {
  caseRimDrop: number;
  caseSpacing: number;
  centerColumn: number;
  centerRow: number;
  columns: 5 | 6;
  extraHeight: number;
  extraWidth: number;
  keycapStyle: KeycapStyles;
  mcuHolder: MCUHolder;
  rows: 3 | 4;
  side: RenderSide;
  tentingAngle: number;
  thumbOffsets: Vec3;
  webThickness: number;
  zOffset: number;
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
  curveColumn: number;
  curveRow: number;
  deltaColumnX: number;
  keycapHeight: number;
  keyholeHeight?: number;
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
  centerRow: 1.5,
  columns: 5,
  encoder: false,
  extraHeight: 0,
  extraWidth: 1.4,
  keycapStyle: "choc",
  mcuHolder: "elite-c",
  rows: 3,
  side: "right",
  switchSpacing: "choc",
  switchStyle: "choc",
  tentingAngle: 14,
  thumbOffsets: [8, -5, 0],
  trackpad: true,
  webThickness: 2,
  zOffset: 9,
};

export let options: Required<Options>;
export let parameters: Parameters;

export const buildOptions = (userOptions: Partial<Options> = {}) => {
  options = { ...defaultOptions, ...userOptions } as Options;
  buildParameters(options);
};

export const buildParameters = (
  o: Required<Options>,
  overrides: Partial<Parameters> = {}
) => {
  const keyholeWidth = o.switchStyle === "choc" ? 13.8 : 14.95;
  const keyholeHeight = keyholeWidth;
  const mountWidth = keyholeWidth + (o.switchSpacing === "choc" ? 3.2 : 4.7);
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

  parameters = {
    curveColumn,
    curveRow,
    deltaColumnX,
    keycapHeight,
    keyholeHeight,
    keyholeWidth,
    keyTopHeight,
    mountHeight,
    mountWidth,
    radiusColumn,
    radiusRow,
    ...overrides,
  };
};
