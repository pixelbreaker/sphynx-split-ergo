import { circle, square, polygon, importModel } from "../src/csg/primitives";
import { FProp, Vec2, Vec3 } from "../src/csg/base";
import { cube, cylinder, sphere, polyhedron } from "../src/csg/primitives";
import { hole } from "./utils";
import { polyRound } from "../src/csg/polyround";
import {
  buildOptions,
  options as o,
  parameters as p,
} from "../src/sphynx-types";
import { Shape3 } from "../src/csg/base3";
import { deg2rad } from "../src/math";
import { matrix, multiply, add, zeros } from "mathjs";

buildOptions({
  columns: 5,
  rows: 3,
  caseRimDrop: 2,
  caseSpacing: 2,
  // tentingAngle: 30,
  // zOffset: 20,
  switchSpacing: "choc",
  switchStyle: "choc",
  keycapStyle: "choc",
  trackpad: false,
  encoder: false,
  mcuHolder: "elite-c",
});

// Key holes
export const filledKeyhole = () =>
  cube([p.mountWidth, p.mountHeight, o.webThickness]).translate([
    0,
    0,
    o.webThickness / 2,
  ]);

export const singleKeyhole = (): Shape3 => {
  const tabThickness = 1.32;
  return cube([p.mountWidth, p.mountHeight, o.webThickness])
    .translate([0, 0, o.webThickness / 2])
    .difference(
      cube([p.keyholeWidth, p.keyholeHeight, o.webThickness + 4]),
      cube([p.keyholeWidth + tabThickness, p.keyholeHeight - 2, o.webThickness])
        .union(
          cube([
            p.keyholeWidth - 2,
            p.keyholeHeight + tabThickness,
            o.webThickness,
          ])
        )
        .translate([0, 0, o.webThickness / 2 - tabThickness])
    );
};

export const singleKeycap = (row: number) =>
  importModel(
    `../models/${o.keycapStyle}${o.keycapStyle === "sa" ? row + 1 : ""}.stl`
  ).translate([0, 0, 4]);
// .rotate([180, 0, 0]);

const getColumnOffset = (column: number): Vec3 => {
  switch (column) {
    case -1:
    case 0: // both index rows should be the same to allow MCU holder to align correctly
    case 1:
      return [0, 0.2, 0];
    case 2:
      return [1, 3, -2.5];
    case 3:
      return [1.6, -1.5, -0.5];
    case 4:
    default:
      return [1.4, -12.5, 2];
  }
};

const getColumnSplay = (column: number): number => {
  switch (column) {
    case -1:
    case 0: // both index rows should be the same to allow MCU holder to align correctly
      return -1.5;
    case 1:
      return -1;
    case 2:
      return 0;
    case 3:
      return 3;
    case 4:
    default:
      return 7;
  }
};

// Placement
const keyPlace = (column: number, row: number, shape: Shape3) => {
  const columnAngle = p.curveRow * (o.centerColumn - column);

  return shape
    .translate([0, 0, -p.radiusRow])
    .rotate([p.curveColumn * (o.centerRow - row), 0, 0])
    .translate([0, 0, p.radiusRow - p.radiusColumn])
    .rotate([0, columnAngle, -getColumnSplay(column)])
    .translate([0, 0, p.radiusColumn])
    .translate(getColumnOffset(column))
    .rotate([0, o.tentingAngle, 0])
    .translate([0, 0, o.zOffset]);
};

const positionRelativeToKey = (column: number, row: number, shape: Shape3) => {
  const columnAngle = p.curveRow * (o.centerColumn - column);

  const pos = shape
    // reverse rotations
    .rotate([-p.curveColumn * (o.centerRow - row), 0, 0])
    .rotate([0, -columnAngle, 0])
    .rotate([0, -o.tentingAngle, 0])
    // end reverse rotations
    .translate([0, 0, -p.radiusRow])
    .rotate([p.curveColumn * (o.centerRow - row), 0, 0])
    .translate([0, 0, p.radiusRow - p.radiusColumn])
    .rotate([0, columnAngle, -getColumnSplay(column)])
    .translate([0, 0, p.radiusColumn])
    .translate(getColumnOffset(column))
    .rotate([0, o.tentingAngle, 0])
    .translate([0, 0, o.zOffset]);

  return pos;
};

const getKeyPosition = (column: number, row: number) => {
  let position = matrix([0, 0, 0]);

  const rotateX = (angle: number) => {
    const rad = deg2rad(angle);
    return multiply(
      [
        [1, 0, 0],
        [0, Math.cos(rad), -Math.sin(rad)],
        [0, -Math.sin(rad), Math.cos(rad)],
      ],
      position
    );
  };

  const rotateY = (angle: number) => {
    const rad = deg2rad(angle);
    return multiply(
      [
        [Math.cos(rad), 0, Math.sin(rad)],
        [0, 1, 0],
        [-Math.sin(rad), 0, Math.cos(rad)],
      ],
      position
    );
  };

  const rotateZ = (angle: number) => {
    const rad = deg2rad(angle);
    return multiply(
      [
        [Math.cos(rad), -Math.sin(rad), 0],
        [Math.sin(rad), Math.cos(rad), 0],
        [0, 0, 1],
      ],
      position
    );
  };

  const columnAngle = p.curveRow * (o.centerColumn - column);
  position = rotateX(-p.curveColumn * (o.centerRow - row));
  position = rotateY(-columnAngle);
  position = rotateY(-o.tentingAngle);
  position = add(position, [0, 0, -p.radiusRow]) as math.Matrix;
  position = rotateX(p.curveColumn * (o.centerRow - row));
  position = add(position, [0, 0, p.radiusRow - p.radiusColumn]) as math.Matrix;
  position = rotateY(columnAngle);
  position = rotateZ(-getColumnSplay(column));
  position = add(position, [0, 0, p.radiusColumn]) as math.Matrix;
  position = add(position, getColumnOffset(column)) as math.Matrix;
  position = rotateY(o.tentingAngle);
  position = add(position, [0, 0, o.zOffset]) as math.Matrix;

  return position.toArray() as Vec3;
};

const placeKeys = (shape: Shape3 | Function) => {
  const keys = [];
  for (let i = 0; i < o.columns; i++) {
    for (let j = 0; j < o.rows; j++) {
      let key =
        typeof shape === "function" ? (shape(j) as Shape3) : (shape as Shape3);
      keys.push(keyPlace(i, j, key));
    }
  }

  const [firstKey, ...restKeys] = keys;
  return firstKey.union(...restKeys);
};

// Thumb keys
const placeThumb = (rot: Vec3, move: Vec3, shape: Shape3) => {
  return positionRelativeToKey(1, o.rows - 1, shape.rotate(rot).translate(move))
    .translate(o.thumbOffsets)
    .translate([p.mountWidth / 2, -p.mountHeight / 2, 0]);
};

const thumbRPlace = (shape: Shape3): Shape3 =>
  placeThumb(
    o.trackpad ? [11.5, -10, 8] : o.encoder ? [0, 0, 10] : [11.5, -26, 10],
    o.trackpad
      ? [-2, -12.3, -6]
      : o.encoder
      ? [-13, -9, -10]
      : [-15, -10.3, -1],
    shape
  );

const thumbMPlace = (shape: Shape3): Shape3 =>
  placeThumb([9, -12.5, 23], [-33.8, -16.2, -7.8], shape);

const thumbLPlace = (shape: Shape3): Shape3 =>
  placeThumb([8, 0, 33], [-52, -26, -10], shape);

const placeThumbs = (shape: Shape3 | Function): Shape3 => {
  let key =
    typeof shape === "function" ? (shape(1) as Shape3) : (shape as Shape3);
  return thumbRPlace(key).union(thumbMPlace(key), thumbLPlace(key));
};

// Utility shapes
// const webThickness = 2;
const postSize = 0.1;
const sphereSize = 3; //webThickness;

const webSphere = sphere({ d: sphereSize, $fn: 20 }).translate([
  0,
  0,
  sphereSize / -2 + o.webThickness - o.caseRimDrop,
]);
const webPost = cube([postSize, postSize, o.webThickness]).translate([
  // const webPost = sphere({ d: weo.bThickness + 0.05, $fn: 12 }).translate([
  0,
  0,
  o.webThickness / -2 + o.webThickness,
]);
const postOffset = { x: postSize / 2, y: postSize / 2 };
const sphereOffset = { x: o.caseSpacing, y: o.caseSpacing };

const getWebPost = (
  pos: "TL" | "TR" | "BL" | "BR",
  shape: Shape3,
  offset: { x: number; y: number } = postOffset
) => {
  const [y, x] = pos.split("");

  return shape.translate([
    x === "L" ? p.mountWidth / -2 + offset.x : p.mountWidth / 2 - offset.x,
    y === "T" ? p.mountHeight / 2 - offset.y : p.mountHeight / -2 + offset.y,
    0,
  ]);
};
const webPostTR = getWebPost("TR", webPost);
const webPostTL = getWebPost("TL", webPost);
const webPostBL = getWebPost("BL", webPost);
const webPostBR = getWebPost("BR", webPost);
const webSphereTR = getWebPost("TR", webSphere, sphereOffset);
const webSphereTL = getWebPost("TL", webSphere, sphereOffset);
const webSphereBL = getWebPost("BL", webSphere, sphereOffset);
const webSphereBR = getWebPost("BR", webSphere, sphereOffset);

// Main key connectors
// util to partition array in to incremental segments
// used to build triangle hulls
const partition = <T extends any>(
  arr: Array<T>,
  size: number,
  offset: number
): Array<Array<T>> => {
  const partitionCount = arr.length - size + offset;
  const partitions: Array<Array<T>> = [];

  for (let i = 0; i < partitionCount; i++) {
    const start = i * offset;
    partitions.push(arr.slice(start, start + size));
  }

  return partitions;
};

const triangleHulls = (...args: Shape3[]) => {
  const triGroups = partition<Shape3>(args, 3, 1);
  const shapes: Shape3[] = [];
  triGroups.forEach(([first, ...rest]) => {
    shapes.push(first.hull(...rest)); // hull here
  });
  const [first, ...rest] = shapes;
  return first.union(...rest);
};

const keyConnectors = () => {
  const connectors: Shape3[] = [];

  // rows
  for (let col = -1; col < o.columns; col++) {
    for (let row = 0; row < o.rows; row++) {
      connectors.push(
        triangleHulls(
          keyPlace(col + 1, row, webPostTL),
          keyPlace(col, row, webPostTR),
          keyPlace(col + 1, row, webPostBL),
          keyPlace(col, row, webPostBR)
        )
      );
    }
  }

  // columns
  for (let col = 0; col < o.columns; col++) {
    for (let row = -1; row < o.rows; row++) {
      connectors.push(
        triangleHulls(
          keyPlace(col, row, webPostBL),
          keyPlace(col, row, webPostBR),
          keyPlace(col, row + 1, webPostTL),
          keyPlace(col, row + 1, webPostTR)
        )
      );
    }
  }

  // corners
  for (let col = -1; col < o.columns; col++) {
    for (let row = -1; row < o.rows; row++) {
      connectors.push(
        triangleHulls(
          keyPlace(col, row, webPostBR),
          keyPlace(col, row + 1, webPostTR),
          keyPlace(col + 1, row, webPostBL),
          keyPlace(col + 1, row + 1, webPostTL)
        )
      );
    }
  }
  const [first, ...rest] = connectors;

  return first.union(...rest);
};

// Rims & Walls
const leftRim = () => {
  const rimHulls = [];
  for (let row = -1; row < o.rows; row++) {
    rimHulls.push(
      triangleHulls(
        keyPlace(-1, row, webSphereBR),
        keyPlace(-1, row + 1, webSphereTR),
        keyPlace(-1, row, webPostBR),
        keyPlace(-1, row + 1, webPostTR)
      )
    );
    if (row >= 0) {
      rimHulls.push(
        triangleHulls(
          keyPlace(-1, row, webPostTR),
          keyPlace(-1, row, webSphereTR),
          keyPlace(-1, row, webPostBR),
          keyPlace(-1, row, webSphereBR)
        )
      );
    }
  }

  const [first, ...rest] = rimHulls;

  return first.union(...rest);
};

const leftWall = () => {
  const walls = [];
  for (let row = -1; row < o.rows; row++) {
    const joint = keyPlace(-1, row, webSphereBR).hull(
      keyPlace(-1, row + 1, webSphereTR)
    );
    walls.push(
      joint
        .projection()
        .linear_extrude({ height: 1, center: false })
        .hull(joint)
    );
    if (row >= 0) {
      const side = keyPlace(-1, row, webSphereTR).hull(
        keyPlace(-1, row, webSphereBR)
      );
      walls.push(
        side
          .projection()
          .linear_extrude({ height: 1, center: false })
          .hull(side)
      );
    }
  }

  const [first, ...rest] = walls;

  return first.union(...rest);
};

const topRim = () => {
  const rimHulls = [];

  let pOffset = 0;
  let pDiff = 0;
  for (let col = -1; col < o.columns; col++) {
    const offset = getColumnOffset(col + 1)[2];
    const diff = offset - pOffset;
    const sphX = sphereOffset.x;

    const xR = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
    const xL = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
    const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : sphX;
    const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? -sphX : sphX) : sphX;

    const offsetR = { ...sphereOffset, x: xR };
    const offsetL = { ...sphereOffset, x: xL };
    const pOffsetR = { ...sphereOffset, x: pR };

    rimHulls.push(
      triangleHulls(
        keyPlace(col, -1, getWebPost("BR", webSphere, offsetL)),
        keyPlace(col, -1, webPostBR),
        keyPlace(col + 1, -1, getWebPost("BL", webSphere, offsetR)),
        keyPlace(col + 1, -1, webPostBL)
      )
    );
    if (col >= 0) {
      rimHulls.push(
        triangleHulls(
          keyPlace(col, -1, getWebPost("BL", webSphere, pOffsetR)),
          keyPlace(col, -1, getWebPost("BR", webSphere, offsetL)),
          keyPlace(col, -1, webPostBL),
          keyPlace(col, -1, webPostBR)
        )
      );
    }
    pOffset = offset;
    pDiff = diff;
  }

  const [first, ...rest] = rimHulls;

  return first.union(...rest);
};

const topWall = () => {
  const walls = [];

  let pOffset = 0;
  let pDiff = 0;
  for (let col = -1; col < o.columns; col++) {
    const offset = getColumnOffset(col + 1)[2];
    const diff = offset - pOffset;
    const sphX = sphereOffset.x;

    const xR = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
    const xL = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
    const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : sphX;
    const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? -sphX : sphX) : sphX;

    const offsetR = { ...sphereOffset, x: xR };
    const offsetL = { ...sphereOffset, x: xL };
    const pOffsetR = { ...sphereOffset, x: pR };

    const joint = keyPlace(col, -1, getWebPost("BR", webSphere, offsetL)).hull(
      keyPlace(col + 1, -1, getWebPost("BL", webSphere, offsetR))
    );
    walls.push(
      joint
        .projection()
        .linear_extrude({ height: 1, center: false })
        .hull(joint)
    );
    if (col >= 0) {
      const joint = keyPlace(
        col,
        -1,
        getWebPost("BL", webSphere, pOffsetR)
      ).hull(keyPlace(col, -1, getWebPost("BR", webSphere, offsetL)));
      walls.push(
        joint
          .projection()
          .linear_extrude({ height: 1, center: false })
          .hull(joint)
      );
    }
    pOffset = offset;
    pDiff = diff;
  }

  const [first, ...rest] = walls;

  return first.union(...rest);
};

const rightRim = () => {
  const rimHulls = [];
  for (let row = -1; row < o.rows; row++) {
    rimHulls.push(
      triangleHulls(
        keyPlace(o.columns, row, webSphereBL),
        keyPlace(o.columns, row + 1, webSphereTL),
        keyPlace(o.columns, row, webPostBL),
        keyPlace(o.columns, row + 1, webPostTL)
      )
    );
    if (row >= 0) {
      rimHulls.push(
        triangleHulls(
          keyPlace(o.columns, row, webPostTL),
          keyPlace(o.columns, row, webSphereTL),
          keyPlace(o.columns, row, webPostBL),
          keyPlace(o.columns, row, webSphereBL)
        )
      );
    }
  }

  const [first, ...rest] = rimHulls;

  return first.union(...rest);
};

const rightWall = () => {
  const walls = [];
  for (let row = -1; row < o.rows; row++) {
    const joint = keyPlace(o.columns, row, webSphereBL).hull(
      keyPlace(o.columns, row + 1, webSphereTL)
    );
    walls.push(
      joint
        .projection()
        .linear_extrude({ height: 1, center: false })
        .hull(joint)
    );
    if (row >= 0) {
      const side = keyPlace(o.columns, row, webSphereBL).hull(
        keyPlace(o.columns, row, webSphereTL)
      );
      walls.push(
        side
          .projection()
          .linear_extrude({ height: 1, center: false })
          .hull(side)
      );
    }
  }

  const [first, ...rest] = walls;

  return first.union(...rest);
};

const bottomRim = () => {
  const rimHulls = [];

  let pOffset = 0;
  let pDiff = 0;
  const sphX = sphereOffset.x;

  for (let col = o.columns - 1; col >= 3; col--) {
    const offset = getColumnOffset(col)[2];
    const diff = offset - pOffset;

    const xR = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
    const xL = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
    const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : -sphX;
    const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? sphX : -sphX) : -sphX;

    const offsetR = { ...sphereOffset, x: xR };
    const offsetL = { ...sphereOffset, x: xL };
    const pOffsetR = { ...sphereOffset, x: pR };
    const pOffsetL = { ...sphereOffset, x: pL };

    rimHulls.push(
      triangleHulls(
        keyPlace(col, o.rows, getWebPost("TR", webSphere, offsetR)),
        keyPlace(col, o.rows, webPostTR),
        keyPlace(col + 1, o.rows, getWebPost("TL", webSphere, offsetL)),
        keyPlace(col + 1, o.rows, webPostTL)
      )
    );
    if (col >= 0) {
      rimHulls.push(
        triangleHulls(
          keyPlace(col, o.rows, getWebPost("TL", webSphere, pOffsetL)),
          keyPlace(col, o.rows, getWebPost("TR", webSphere, pOffsetR)),
          keyPlace(col, o.rows, webPostTL),
          keyPlace(col, o.rows, webPostTR)
        )
      );
    }
    pOffset = offset;
    pDiff = diff;
  }

  const [first, ...rest] = rimHulls;

  return first.union(...rest);
};

const bottomWall = () => {
  const walls = [];

  let pOffset = 0;
  let pDiff = 0;
  const sphX = sphereOffset.x;

  for (let col = o.columns - 1; col >= 3; col--) {
    const offset = getColumnOffset(col)[2];
    const diff = offset - pOffset;

    const xR = Math.abs(diff) !== 0 ? (diff > 0 ? -sphX : sphX) : sphX;
    const xL = Math.abs(diff) !== 0 ? (diff < 0 ? -sphX : sphX) : sphX;
    const pR = Math.abs(pDiff) !== 0 ? (pDiff < 0 ? -sphX : sphX) : -sphX;
    const pL = Math.abs(pDiff) !== 0 ? (pDiff > 0 ? sphX : -sphX) : -sphX;

    const offsetR = { ...sphereOffset, x: xR };
    const offsetL = { ...sphereOffset, x: xL };
    const pOffsetR = { ...sphereOffset, x: pR };
    const pOffsetL = { ...sphereOffset, x: pL };

    const joint = keyPlace(
      col,
      o.rows,
      getWebPost("TR", webSphere, offsetR)
    ).hull(keyPlace(col + 1, o.rows, getWebPost("TL", webSphere, offsetL)));
    walls.push(
      joint
        .projection()
        .linear_extrude({ height: 1, center: false })
        .hull(joint)
    );
    if (col >= 0) {
      const joint = keyPlace(
        col,
        o.rows,
        getWebPost("TL", webSphere, pOffsetL)
      ).hull(keyPlace(col, o.rows, getWebPost("TR", webSphere, pOffsetR)));
      walls.push(
        joint
          .projection()
          .linear_extrude({ height: 1, center: false })
          .hull(joint)
      );
    }
    pOffset = offset;
    pDiff = diff;
  }

  const [first, ...rest] = walls;

  return first.union(...rest);
};

export const caseWalls = () => {
  return leftRim().union(
    leftWall(),
    topRim(),
    topWall(),
    rightRim(),
    rightWall(),
    bottomRim(),
    bottomWall()
  );
};

export const USBHolder = () => {
  const [x, y] = getKeyPosition(1, 0);
  return importModel(`../models/${o.mcuHolder}.stl`)
    .translate([x, y + 1.2, 0])
    .translate([
      -p.mountWidth / 2,
      p.mountHeight / 2 + o.caseSpacing + sphereSize + 0.5,
      0,
    ])
    .translate([o.mcuHolder === "rpi-pico" ? -1 : 0, 0, 0]);
};

export const USBHolderSpace = () => {
  return USBHolder()
    .projection()
    .linear_extrude({ height: 13.01, center: false })
    .translate([0, 0, -1]);
};

export const main = placeKeys(singleKeyhole()).union(
  // importModel("../models/cirque-40-flat.stl"),
  keyConnectors(),
  caseWalls().difference(USBHolderSpace()),
  placeThumbs(singleKeyhole()),
  // USBHolder().debug()
  // preview keys
  placeKeys((row: number) => singleKeycap(row)).color("grey"),
  placeThumbs((row: number) => singleKeycap(row)).color("grey")
  // positionRelativeToKey(1, o.rows - 1, cube([1, 1, 1]))
);
