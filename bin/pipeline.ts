#!/usr/bin/env ts-node
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

const arg = process.argv[2];

// get scad
const gen_scad = path.join(__dirname, 'gen-scad.ts');
const scad_result = execSync([
  process.platform.startsWith('win') ? 'npm.cmd' : 'npm',
  'run', 'ts', gen_scad, arg
].join(' ')).toString();
const base_file = scad_result.match(/saved (.*)\.scad/)[1];
const scad_file = base_file + '.scad';

// get stl
console.log('openscad generating stl from', scad_file);
const stl_file = base_file + '.stl';
const stl_result = execSync([
  'openscad', '-o', stl_file, scad_file
].join(' ')).toString();
console.log(stl_result);

// get gcode
console.log('slic3r generating gcode from', stl_file);
const gcode_file = base_file + '.gcode';
const gcode_result = execSync([
  '%userprofile%\\Slic3r-1.3.0.64bit\\Slic3r-console.exe',
  '--output', gcode_file,
  '--load', path.join(__dirname, '..', 'slic3r_config', 'cube_normal_duramic_black.ini'),
  stl_file
].join(' ')).toString();
console.log(gcode_result);

// upload
console.log('uploading gcode to http://octopi', gcode_file);
const upload_result = execSync([
  'curl', '-k', '-H',
  '"X-Api-Key: E01B67DAC70E45FB87F33CE3CC0CF803"',
  '-F', '"select=false"',
  '-F', '"print=false"',
  '-F', `"file=@${gcode_file}"`,
  'http://octopi/api/files/local'
].join(' ')).toString();
console.log(upload_result);


console.log('done');



