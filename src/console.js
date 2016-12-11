import {Console} from 'console';

/** Global, singleton console that doesn't necessarily log to stdout and stderr */
export let console;

export function create(stdout = process.stdout, stderr = process.stderr) {
  console = new Console(stdout, stderr);
}