#!/usr/bin/env ts-node
import * as path from 'path';
import * as os from 'os';
import { execSync, spawnSync } from 'child_process';
import { OutputSettings } from './gen-scad';

const file = process.argv[2];
console.time('done');

// get scad
console.log(file, '[node: ts -> scad]');
console.time('node');
const gen_scad = path.join(__dirname, 'gen-scad.ts');
const scad_result = execSync([
  process.platform.startsWith('win') ? 'npm.cmd' : 'npm',
  'run', 'ts', gen_scad, file
].join(' ')).toString();
const json = scad_result.split('--LINE-BREAK--')[1];
console.log(scad_result);
console.log(json);
const settings: OutputSettings = JSON.parse(json);
const scad_file = settings.fileName;
const base_file = scad_file.slice(0, -5);

// get stl
console.log(scad_file, '[openscad: scad -> stl]');
console.time('openscad');
const stl_file = base_file + '.stl';
const stl_result = spawnSync('openscad', [
  '-o', stl_file, scad_file
]).output.join('\n');
console.log(stl_result);
console.timeEnd('openscad');
if (stl_result.indexOf('WARNING') !== -1) {
  console.log('openscad errors/warnings detected, exiting');
  process.exit(1);
}

// get gcode
console.log(stl_file, '[slic3r: stl -> gcode]');
console.time('slic3r');
const gcode_file = base_file + '.gcode';
const slice_cmd = [
  '%userprofile%\\Slic3r-1.3.0.64bit\\Slic3r-console.exe',
  '--output', gcode_file,
  '--load', path.join(__dirname, '..', 'slic3r_config', 'cube_normal_duramic_black.ini')
];
Object.entries(settings.slicer || {}).forEach(([key, val]) => {
  slice_cmd.push(`--${key}`, `${val}`);
})
slice_cmd.push(stl_file);
const slice_cmd_str = slice_cmd.join(' ');
console.log(slice_cmd_str);
const gcode_result = execSync(slice_cmd_str).toString();
console.log(gcode_result);
console.timeEnd('slic3r');

// upload
console.log(gcode_file, '[curl: gcode -> octopi]');
console.time('curl');
const upload_result = execSync([
  'curl', '-k', '-H',
  '"X-Api-Key: E01B67DAC70E45FB87F33CE3CC0CF803"',
  '-F', '"select=false"',
  '-F', '"print=false"',
  '-F', `"file=@${gcode_file}"`,
  'http://octopi/api/files/local'
].join(' ')).toString();
console.log(upload_result);
console.timeEnd('curl');


console.log(`\n${new Date().toLocaleString()}`, 'processed', file);
console.timeEnd('done');


