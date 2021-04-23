#!/usr/bin/env ts-node
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { execSync, spawnSync } from 'child_process';
import { OutputSettings, genScad } from './gen-scad';

const cwd = process.cwd();
const watchDir = path.join(cwd, 'projects');
const outputDir = path.join(cwd, 'target');

const arg = process.argv[2];
const file = path.normalize(arg.startsWith('.') ? path.join(process.cwd(), arg) : arg);
const name = path.basename(file, '.ts');
const target = path.join(outputDir, file.substr(watchDir.length));
const targetDir = path.dirname(target);
const base_output = path.join(targetDir, name);

type FileType = 'ts' | 'scad' | 'stl' | 'gcode' | 'upload';
const typedString = <T extends FileType>(s: string, t: T) => {
  if (t) {
    return (s + "." + t) as T;
  } else {
    return s as T;
  }
}

//do pipeline
const main = () => {
  console.time('done');
  getScad(typedString(file, null as 'ts')).then(({ out: scad, settings }) => {
    const stl = getStl(scad);
    const gcode = getGcode(settings, stl);
    const upload = doUpload(gcode);
    console.log(`\n${new Date().toLocaleString()}`, 'processed', file);
    console.timeEnd('done');
  });
};

const getScad = (input: 'ts'): Promise<{ out: 'scad', settings: OutputSettings }> => {
  console.log(file, '[node: ts -> scad]');
  console.time('node');
  const out = typedString(base_output, 'scad');
  console.log(out);
  return genScad(input, out).then(settings => {
    console.timeEnd('node');
    return { out, settings };
  });
}

const getStl = (input: 'scad') => {
  console.log(input, '[openscad: scad -> stl]');
  console.time('openscad');
  const out = typedString(base_output, 'stl');
  const stl_result = spawnSync('openscad', [
    '-o', out, input
  ]).output.join('\n');
  console.log(stl_result);
  console.timeEnd('openscad');
  if (stl_result.indexOf('WARNING') !== -1) {
    console.log('openscad errors/warnings detected, exiting');
    process.exit(1);
  }
  return out;
}

const getGcode = (o: OutputSettings, input: 'stl') => {
  console.log(input, '[slic3r: stl -> gcode]');
  console.time('slic3r');
  const out = typedString(base_output, 'gcode');
  const slice_cmd = [
    '%userprofile%\\Slic3r-1.3.0.64bit\\Slic3r-console.exe',
    '--output', out,
    '--load', path.join(__dirname, '..', 'slic3r_config', 'cube_normal_duramic_black.ini')
  ];
  Object.entries(o.slicer || {}).forEach(([key, val]) => {
    slice_cmd.push(`--${key}`, `${val}`);
  })
  slice_cmd.push(input);
  const slice_cmd_str = slice_cmd.join(' ');
  console.log(slice_cmd_str);
  const gcode_result = execSync(slice_cmd_str).toString();
  console.log(gcode_result);
  console.timeEnd('slic3r');
  return out;
};

const doUpload = (input: 'gcode') => {
  console.log(input, '[curl: gcode -> octopi]');
  console.time('curl');
  const out = typedString(base_output, 'upload');
  const upload_result = execSync([
    'curl', '-k', '-H',
    '"X-Api-Key: E01B67DAC70E45FB87F33CE3CC0CF803"',
    '-F', '"select=false"',
    '-F', '"print=false"',
    '-F', `"file=@${input}"`,
    'http://octopi/api/files/local',
    ' && ',
    'touch', out
  ].join(' ')).toString();
  console.log(upload_result);
  console.timeEnd('curl');
  return out;
}

main();