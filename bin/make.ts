import * as fs from 'fs';
import { spawn } from 'child_process';
/**
 * Simple file dependency/invoke based on modified file date - like Make
 */


type FileTask = {
  deps: string[];
  action: (...a: any[]) => Promise<unknown>;
};

const getMTime = (f: string) => new Promise<number>((resolve, reject) => {
  fs.stat(f, (e, s) => {
    if (e) {
      resolve(0); // a file that does not exists is like a very stale file;
    } else {
      resolve(s.mtime.getTime());
    }
  })
});

const isOlder = (a: string, ...b: string[]): Promise<boolean> => {
  return Promise.all([a, ...b].map(getMTime))
    .then(([a, ...b]) => {
      return a < Math.max(...b);
    });
}

export const spawnPromise = (cmd: string, args: string[] = []): Promise<string> =>
  new Promise((resolve, reject) => {
    const ch = spawn(cmd, args, { shell: true });
    const buffer: string[] = [];
    const cb = (data: any) => {
      const str = data.toString();
      console.log(str);
      buffer.push(str);
    };
    ch.stdout.on('data', cb);
    ch.stderr.on('data', cb);
    ch.on('close', (code) => {
      const result = buffer.join('');
      if (code > 0) {
        reject(`error exec ${cmd} \n ${result}`);
      } else {
        resolve(result);
      }
    });
  });

export class TaskCollection {
  graph = new Map<string, FileTask>();

  add<T extends string, U extends string[]>(
    t: T,
    action: (t: T, ...deps: U) => Promise<{}>,
    ...deps: U
  ) {
    this.graph.set(t, { deps, action });
  }
  
  do(filename: string): Promise<string> {
    const task = this.graph.get(filename);
    if (task) {
      const promises = task.deps.map(t => this.do(t));
      return Promise.all(promises)
        .then(deps => isOlder(filename, ...deps)
          .then(stale => {
            if (stale) {
              console.log('action', filename);
              console.time(filename);
              return task.action(filename, ...deps)
                .then(() => {
                  console.timeEnd(filename);
                  return filename;
                })
            } else {
              console.log('skip  ', filename);
              return filename;
            }
          }));
    } else {
      return getMTime(filename).then(t => {
        if (t > 0) {
          return filename
        } else {
          throw 'file not found ' + filename;
        }
      });
    }
  }
}