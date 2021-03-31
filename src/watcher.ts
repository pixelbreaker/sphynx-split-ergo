#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as _ from 'lodash';

const cwd = process.cwd();
const watchDir = path.join(cwd, 'projects');
const outputDir = path.join(cwd, 'target');

const resetNodeCache = () => {
  for (const path in require.cache) {
    if (path.endsWith('.js') || path.endsWith('.ts')) { // only clear *.js, not *.node
      delete require.cache[path]
    }
  }
}

export const header = `include <${path.join(cwd, 'scad_modules', 'polyround.scad')}>`;

const load = (file: string) => {
  try {
    if (!file.endsWith('.ts')) {
      return;
    }
    console.log('detected', file);
    const name = path.basename(file, '.ts');
    const target = path.join(outputDir, file.substr(watchDir.length));
    const targetDir = path.dirname(target);
    fs.mkdirSync(targetDir, { recursive: true });
    resetNodeCache();
    import(file).then(mod => {
      if ('main' in mod) {
        const src: string = header + '\n' + mod.main.src.join('\n');
        const fileName = path.join(targetDir, name + ".scad");
        fs.writeFile(fileName, src, e => {
          if (e) {
            console.log("error", fileName, e);
          } else {
            //  console.log(src);
            console.log("saved", fileName);
          }
        });
      }
    }).catch(e => {
      console.log(e);
    });
  } catch (e) {
    console.log('error', file, e);
  }
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
      val.forEach(v => load(path.join(key, v)));
    });
}, 300);

watcher.on('change', updateAll);
watcher.on('ready', () => {
  console.log('watching');
  console.log(watcher.getWatched());
});
