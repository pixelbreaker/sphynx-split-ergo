import { Vec3 } from "../src/csg/base";
import { deg2rad } from "../src/math";

export type SwitchTypes = "choc" | "mx";
export type SwitchStyle = SwitchTypes;
export type SwitchSpacing = SwitchTypes;
export type KeycapStyles = "choc" | "xda" | "sa";
export type RenderSide = "right" | "left";

export type Options = {
  accessoryHolder: boolean;
  caseRimDrop: number;
  caseSpacing: number;
  centerColumn: number;
  centreRow: number;
  columns: 5 | 6;
  extraHeight: number;
  extraWidth: number;
  feetDiameter: number;
  feetInsetDepth: number;
  insertDepth: number;
  insertExternal: number;
  insertInternal: number;
  keycapStyle: KeycapStyles;
  plateThickness: number;
  rows: 3 | 4;
  screwHoleCountersinkDiameter: number;
  screwHoleDiameter: number;
  tentingAngle: number;
  thumbOffsets: Vec3;
  trackballCutoutInPlate: boolean;
  webThickness: number;
  zOffset: number;
} & ( // Discriminated union to ensure mx switches have mx spacing only
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
  trackpadOffsetZ: number;
};

export const defaultOptions: Options = {
  accessoryHolder: true,
  caseRimDrop: 2,
  caseSpacing: 2.5,
  centerColumn: 2.5,
  centreRow: 1.5,
  columns: 5,
  extraHeight: 0,
  extraWidth: 1.5,
  feetDiameter: 8.5,
  feetInsetDepth: 1,
  insertDepth: 4,
  insertExternal: 10,
  insertInternal: 5.4,
  keycapStyle: "xda",
  plateThickness: 2.5,
  rows: 3,
  screwHoleCountersinkDiameter: 9,
  screwHoleDiameter: 4.6,
  switchSpacing: "mx",
  switchStyle: "mx",
  tentingAngle: 14,
  thumbOffsets: [6, -5, -3],
  trackballCutoutInPlate: true,
  webThickness: 2,
  zOffset: 11,
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
  const keyholeWidth = o.switchStyle === "choc" ? 13.82 : 13.95;
  const keyholeHeight = keyholeWidth;
  const mountWidth = keyholeWidth + (o.switchSpacing === "choc" ? 3.2 : 4);
  const mountHeight = mountWidth;
  const keycapHeight = o.keycapStyle === "choc" ? 9 : 13;
  const keyTopHeight = o.webThickness + keycapHeight;
  const curveColumn = 13;
  const curveRow = 4;
  const radiusRow =
    keyTopHeight +
    (mountHeight + o.extraHeight + (o.switchStyle === "mx" ? 1.4 : 0)) /
      2 /
      Math.sin(deg2rad(curveColumn / 2));
  const radiusColumn =
    keyTopHeight +
    (mountWidth + o.extraWidth + (o.switchStyle === "mx" ? 0.6 : 0)) /
      2 /
      Math.sin(deg2rad(curveRow / 2));
  const deltaColumnX = -(1 + radiusColumn * Math.sin(deg2rad(curveRow)));
  const centreRow = o.rows - o.centreRow;
  const keyholeThickness = o.switchStyle === "choc" ? 2 : 4;
  const trackpadOffsetZ = 13; //o.switchStyle === "choc" ? 8.5 : 14;

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
    trackpadOffsetZ,
    ...overrides,
  };
};
