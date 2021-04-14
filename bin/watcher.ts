#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as _ from 'lodash';
import { spawn } from 'child_process';

const cwd = process.cwd();
const watchDir = path.join(cwd, 'projects');
const gen_scad = path.join(__dirname, 'gen-scad.ts');

const generateScad = (file: string) => {
  spawn(
    process.platform.startsWith('win') ? 'npm.cmd' : 'npm', [
    'run', 'ts', gen_scad, file
  ], { stdio: 'inherit' });
}

const watcher = chokidar.watch(watchDir, {
  ignored: (p: string) =>
    path.basename(p).startsWith('.') ||
    p.includes('target') ||
    p.includes('node_modules')
});

const updateAll = _.debounce(() => {
  Object.entries(watcher.getWatched())
    .forEach(([key, val]) => {
      val.forEach(v => generateScad(path.join(key, v)));
    });
}, 300);

const updateFile = _.debounce((path: string, stats: fs.Stats) => {
  generateScad(path);
}, 300);

watcher.on('change', updateFile);
watcher.on('ready', () => {
  console.log('watching');
  console.log(watcher.getWatched());
});
