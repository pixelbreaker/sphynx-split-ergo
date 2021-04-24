#!/usr/bin/env ts-node
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { OutputSettings, genScad, genSettings } from './gen-scad';
import { spawnPromise, TaskCollection } from './make';


const cwd = process.cwd();
const watchDir = path.join(cwd, 'projects');
const outputDir = path.join(cwd, 'target');

const arg = process.argv[2];
const file = path.normalize(arg.startsWith('.') ? path.join(process.cwd(), arg) : arg);
const name = path.basename(file, '.ts');
const target = path.join(outputDir, file.substr(watchDir.length));
const base_output = path.join(path.dirname(target), name);


type FileType = 'ts' | 'settings.json' | 'scad' | 'stl' | 'gcode' | 'upload';

// coerce file paths into types
const tf = <T extends FileType>(s: string, t: T): T => {
  const path = s.endsWith(t) ? s : s + "." + t;
  return path as T;
}
const tasks = new TaskCollection();

tasks.add(tf(base_output, 'scad'), genScad, tf(file, 'ts'));

tasks.add(tf(base_output, 'settings.json'), genSettings, tf(file, 'ts'));

tasks.add(tf(base_output, 'stl'), (out, input) => spawnPromise('openscad', ['-o', out, input])
  .then(stl_result => {
    if (stl_result.indexOf('WARNING') !== -1) {
      console.log('openscad errors/warnings detected, exiting');
      process.exit(1);
    }
    return null;
  }), tf(base_output, 'scad'));

tasks.add(tf(base_output, 'gcode'), (out, settings, stl) => {
  const args = [
    '--output', out,
    '--load', path.join(__dirname, '..', 'slic3r_config', 'cube_normal_duramic_black.ini')
  ];
  const { slicer } = JSON.parse(fs.readFileSync(settings).toString()) as OutputSettings;
  Object.entries(slicer || {}).forEach(([key, val]) => {
    args.push(`--${key}`, `${val}`);
  })
  args.push(stl);
  return spawnPromise('%userprofile%\\Slic3r-1.3.0.64bit\\Slic3r-console.exe', args);
}, tf(base_output, 'settings.json'), tf(base_output, 'stl'));

tasks.add(tf(base_output, 'upload'),
  (out, gcode) => spawnPromise('curl', ['-k', '-H',
    '"X-Api-Key: E01B67DAC70E45FB87F33CE3CC0CF803"',
    '-F', '"select=false"',
    '-F', '"print=false"',
    '-F', `"file=@${gcode}"`,
    'http://octopi/api/files/local'
  ])
    .then(() => spawnPromise('touch', [out]))
  , tf(base_output, 'gcode'));

tasks.do(tf(base_output, 'upload'));