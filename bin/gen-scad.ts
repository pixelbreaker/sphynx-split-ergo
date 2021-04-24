#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs';
import { SlicerSettings } from '../slic3r_config/slicer-settings';

export type OutputSettings = {
  fileName?: string;
  slicer?: SlicerSettings;
}

const header = `include <${path.join(__dirname, '..', 'scad_modules', 'polyround.scad')}>`;
export const genScad = (out_file: string, in_file: string): Promise<unknown> => {
  const targetDir = path.dirname(out_file);
  fs.mkdirSync(targetDir, { recursive: true });
  return new Promise((resolve, reject) => {
    import(in_file).then(mod => {
      if ('main' in mod) {
        const src: string = header + '\n' + mod.main.src.join('\n');
        fs.writeFile(out_file, src, (e) => {
          if (e) {
            reject(e);
          } else {
            resolve(null);
          }
        });
      };
    }).catch(reject);
  });
};

export const genSettings = (out_file: string, in_file: string): Promise<unknown> => {
  const targetDir = path.dirname(out_file);
  fs.mkdirSync(targetDir, { recursive: true });
  return new Promise((resolve, reject) => {
    import(in_file).then(mod => {
      if ('settings' in mod) {
        const json = JSON.stringify(mod.settings);
        console.log('json', json);
        fs.writeFile(out_file, json, (e) => {
          if (e) {
            reject(e);
          } else {
            resolve(null);
          }
        });
      }
      resolve(null);
    }).catch(reject);
  });
};