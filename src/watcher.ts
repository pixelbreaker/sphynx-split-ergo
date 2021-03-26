#!/usr/bin/env ts-node

import * as path from 'path';
import * as fs from 'fs';
import * as chokidar from 'chokidar';


const cwd = process.cwd();
const dir = path.join(__dirname, '../viewer');


const watchDir = process.argv.length > 2 ? path.join(cwd, process.argv[2]) : cwd;
console.log('watching', watchDir);
chokidar.watch(watchDir, { ignored: ['node_modules/', '.*/'] }).on('change', (path) => {
  console.log(path);
});