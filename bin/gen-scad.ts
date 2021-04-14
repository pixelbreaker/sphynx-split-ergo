#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs';

const cwd = process.cwd();
const watchDir = path.join(cwd, 'projects');
const outputDir = path.join(cwd, 'target');

const header = `include <${path.join(__dirname, '..', 'scad_modules', 'polyround.scad')}>`;
const arg = process.argv[2];
const file = path.normalize(arg.startsWith('.') ? path.join(process.cwd(), arg) : arg);

const name = path.basename(file, '.ts');
const target = path.join(outputDir, file.substr(watchDir.length));
const targetDir = path.dirname(target);
fs.mkdirSync(targetDir, { recursive: true });
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