#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs';
import * as chokidar from 'chokidar';

const cwd = process.cwd();
const outputDir = 'target';
fs.mkdir(outputDir, (e) => { });

const resetNodeCache = () => {
  for (const path in require.cache) {
    if (path.endsWith('.js') || path.endsWith('.ts')) { // only clear *.js, not *.node
      delete require.cache[path]
    }
  }
}

const load = (file: string) => {
  try {
    if (!file.endsWith('.ts')) {
      return;
    }
    console.log('detected', file);
    const name = path.basename(file, '.ts');
    resetNodeCache();
    import(file).then(mod => {
      if ('main' in mod) {
        const src: string = mod.main.src.join('\n');
        const fileName = `${outputDir}/${name}.scad`;
        fs.writeFile(fileName, src, e => {
          if (e) {
            console.log("error", fileName, e);
          } else {
            console.log(src);
            console.log("saved", fileName);
          }
        });
      }
    });
  } catch (e) {
    console.log('error', file, e);
  }
}

const watcher = chokidar.watch(`${cwd}/projects`, {
  ignored: (p: string) =>
    path.basename(p).startsWith('.') ||
    p.includes('target') ||
    p.includes('node_modules')
});
watcher.on('change', load);
watcher.on('ready', () => {
  console.log('watching');
  console.log(watcher.getWatched());
});
