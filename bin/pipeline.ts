#!/usr/bin/env ts-node
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { execSync, spawnSync } from 'child_process';
import { OutputSettings, genScad, genSettings } from './gen-scad';


const cwd = process.cwd();
const watchDir = path.join(cwd, 'projects');
const outputDir = path.join(cwd, 'target');

const arg = process.argv[2];
const file = path.normalize(arg.startsWith('.') ? path.join(process.cwd(), arg) : arg);
const name = path.basename(file, '.ts');
const target = path.join(outputDir, file.substr(watchDir.length));
const targetDir = path.dirname(target);
const base_output = path.join(targetDir, name);

type FileType = 'ts' | 'settings.json' | 'scad' | 'stl' | 'gcode' | 'upload';
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
  const input = typedString(file, null as 'ts');
  const p1 = getScad(input).then(getStl);
  const p2 = getSettings(input);
  Promise.all([p1, p2]).then(([stl, settings]) => {
    const gcode = getGcode(settings, stl);
    doUpload(gcode);
    console.log(`\n${new Date().toLocaleString()}`, 'processed', file);
    console.timeEnd('done');
  });
};

const isOlder = (a: string, ...b: string[]) => {
  if (!fs.existsSync(a)) {
    return true;
  }
  const t1 = fs.statSync(a).mtime.getTime();
  const others = b.map(f => {
    if (fs.existsSync(f)) {
      return fs.statSync(f).mtime.getTime();
    } else {
      return 0;
    }
  });
  return t1 < Math.max(...others);
}

const getScad = async (input: 'ts'): Promise<'scad'> => {
  console.log(file, '[node: ts -> scad]');
  const out = typedString(base_output, 'scad');
  if (isOlder(out, input)) {
    await genScad(input, out);
    return out;
  } else {
    console.log('skip generate scad file');
    return out;
  }
}

const getSettings = async (input: 'ts'): Promise<'settings.json'> => {
  console.log(file, '[node: ts -> settings]');
  const out = typedString(base_output, 'settings.json');
  if (isOlder(out, input)) {
    await genSettings(input, out);
    return out;
  } else {
    console.log('skip generate settings.json');
    return out;
  }
}

const getStl = (input: 'scad') => {
  console.log(input, '[openscad: scad -> stl]');
  console.time('openscad');
  const out = typedString(base_output, 'stl');
  if (isOlder(out, input)) {
    const stl_result = spawnSync('openscad', [
      '-o', out, input
    ]).output.join('\n');
    console.log(stl_result);
    console.timeEnd('openscad');
    if (stl_result.indexOf('WARNING') !== -1) {
      console.log('openscad errors/warnings detected, exiting');
      process.exit(1);
    }
  } else {
    console.log('skip generate stl');
  }
  return out;
}

const getGcode = (settings: 'settings.json', input: 'stl'): 'gcode' => {
  console.log(input, '[slic3r: stl -> gcode]');
  console.time('slic3r');
  const out = typedString(base_output, 'gcode');
  if (isOlder(out, input, settings)) {
    const slice_cmd = [
      '%userprofile%\\Slic3r-1.3.0.64bit\\Slic3r-console.exe',
      '--output', out,
      '--load', path.join(__dirname, '..', 'slic3r_config', 'cube_normal_duramic_black.ini')
    ];
    const { slicer } = JSON.parse(fs.readFileSync(settings).toString()) as OutputSettings;
    Object.entries(slicer || {}).forEach(([key, val]) => {
      slice_cmd.push(`--${key}`, `${val}`);
    })
    slice_cmd.push(input);
    const slice_cmd_str = slice_cmd.join(' ');
    console.log(slice_cmd_str);
    const gcode_result = execSync(slice_cmd_str).toString();
    console.log(gcode_result);
    console.timeEnd('slic3r');
  } else {
    console.log('skip generate gcode');
  }
  return out;
};

const doUpload = (input: 'gcode') => {
  console.log(input, '[curl: gcode -> octopi]');
  console.time('curl');
  const out = typedString(base_output, 'upload');
  if (isOlder(out, input)) {
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
  } else {
    console.log('skip upload');
  }
  return out;
}

main();