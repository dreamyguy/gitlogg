#!/usr/bin/env node
"use strict";

import * as Path from 'path';
import * as fs from 'fs';
import * as os from 'os';

import * as yargs from 'yargs';
import {isInteger} from 'lodash';

import * as packageJson from '../package';
import {red, magenta, yellow, blue, green, reset} from './colors';
import {console, create as createConsole} from './console';
import {NullStream} from './null-stream';
import {outputIntermediateGitLog} from './output-intermediate-gitlog';
import {parseToJson} from './gitlogg-parse-json';
import {mapConcurrent} from './map-concurrent';

// Stack traces will use sourcemaps to show source code locations
try {
  require('source-map-support').install();
} catch(e) {}

// In node < 6.6 unhandled promise rejections are not automatically logged so we do that explicitly
process.on('unhandledRejection', (reason, promise) => {
  console.error(reason);
  process.exit(1);
});

const argv = require('yargs')
    .usage('Usage: $0 [options] [paths..]')
    .example('$0 repo-1 repo-2', 'Write JSON git log for two repositories to stdout')
    .example('$0 -d my-repos', 'Write JSON git log for each subdirectory of "my-repos" to stdout')
    .example('$0 -o output.json repo-1', 'Write JSON git log for "repo-1" to "output.json"')
    .options({
      d: {
        alias: 'directory', //--directory <PATH>
        describe: 'Generate git log for each subdirectory of given path',
        type: 'string',
        nargs: 1,
        normalize: true
      },
      n: {
        alias: 'parallel', //--parallel <NUMBER>
        describe: 'Maximum number of parallel git invocations',
        nargs: 1,
        type: 'number',
        defaultDescription: 'number of CPU cores - 1'
      },
      o: {
        alias: 'out', //--out <PATH>
        describe: 'Output JSON to file',
        nargs: 1,
        type: 'string',
        normalize: true,
      }
    })
    .help('h')
    .alias('h', 'help')
    // If we know the TTY width, expand output up to a maximum width
    // Otherwise, use the default, conservative width
    .wrap(Math.min(process.stdout.columns || /* default = */72, /* max = */110))
    // reject unknown options
    .strict()
    // Support --version
    .version()
    .argv;

// Validate CLI args

// If and only if --out is specified, we can output useful status information to stdout
// Otherwise this information must be suppressed because JSON is being emitted to stdout
if(typeof argv.out === 'string') {
  createConsole();
} else {
  createConsole(new NullStream());
}

// --directory and positional arguments are mutually exclusive
if(typeof argv.directory === 'string' && argv._.length > 0) {
  console.error('[ERROR 004]: ${ yellow }--directory cannot be used with additional paths.${ reset }');
}
if(argv.parallel !== undefined && (!isInteger(argv.parallel) || argv.parallel < 1)) {
  console.error(`[ERROR 005]: ${ yellow }--parallel must be a positive non-zero integer${ reset }`);
}

const NUM_THREADS = argv.parallel
  ? argv.parallel
  // Use n-1 processors per default, so the system is not overloaded
  : os.cpus().length - 1
console.log(`${ blue }Info: Calculating in ${ NUM_THREADS } thread(s)${ reset }`);


/** Array of normalized, absolute paths to git repositories */
const repositories = typeof argv.directory === 'string'
  // Each subdirectory of --directory is a git repository
  ? fs.readdirSync(argv.directory).map(path => Path.join(Path.resolve(argv.directory), path)).filter(path => fs.statSync(path).isDirectory())
  // Each positional argument is a path to a git repository
  : argv._.map(p => Path.resolve(Path.normalize(p)));

// number of directories (repos)
const DIRCOUNT = repositories.length;

// determine if we're dealing with a singular repo or multiple
let reporef;
if(DIRCOUNT > 1) {
  reporef = `${ red }${ DIRCOUNT }${ yellow } repositories${ reset }`;
} else if(DIRCOUNT === 1) {
  reporef = `${ red }${ DIRCOUNT }${ yellow } repository${ reset }`;
} else {
  console.error(`[ERROR 003]: ${ yellow }No repositories specified${ reset }`);
  yargs.showHelp();
  process.exit(1);
}
const reposLocation = typeof argv.directory === 'string' ? ` located at ${ red }${ argv.directory }` : ``;

// start counting seconds elapsed
const startTime = Date.now();

console.log(`${ yellow }Generating ${ magenta }git log ${ yellow }for ${ reporef }${ reposLocation }${ yellow }. ${ blue }This might take a while!${ reset }`);

run();
async function run() {
  const output = {};
  await mapConcurrent(repositories, async (repo) => {
    const dirName = Path.basename(repo);
    const intermediate = await outputIntermediateGitLog(repo);
    const json = parseToJson(intermediate, dirName);
    output[dirName] = json;
  }, NUM_THREADS);

  const jsonString = JSON.stringify(output, null, 2);
  if(typeof argv.out === 'string') {
    fs.writeFileSync(argv.out, jsonString);
  } else {
    fs.writeSync(1, jsonString, undefined, 'utf8');
  }
  console.log(`${ green }Done!${ reset }`);
}
