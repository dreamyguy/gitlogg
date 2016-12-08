#!/usr/bin/env node
import * as fs from 'fs';
import * as Path from 'path';

import * as child_process from 'child_process';
import * as crossSpawn from 'cross-spawn';
import * as streamToString from 'stream-to-string';

import {formatString} from './git-log-fields';
import {console} from './console';
import {magenta, reset} from './colors';

export function outputIntermediateGitLog(dir) {
  // Returns an intermediate representation of git log with the given repository
  const dirName = Path.basename(dir);

  if(!fs.existsSync(dir)) {
    throw new Error(`dir does not exist: ${ dir }`);
  }

  console.log(`Outputting ${ magenta }${ dirName }${ reset }`);

  // const gitProcess = child_process.spawnSync('git', [
  //   '--no-pager', 'log', '--all', '--no-merges', '--shortstat', '--reverse',
  //   `--pretty=tformat:%x00${ formatString }`
  // ], {
  //   cwd: dir,
  //   stdio: ['ignore', 'pipe', 'pipe']
  // });
  // return gitProcess.stdout;

  const gitProcess = crossSpawn('git', [
    '--no-pager', 'log', '--all', '--no-merges', '--shortstat', '--reverse',
    `--pretty=tformat:%x00${ formatString }`
  ], {
    cwd: dir,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  // Capture stderr in a string
  const stderrPromise = streamToString(gitProcess.stderr, 'utf8');
  // Resolves when the process exits with 0.  Rejects on error or non-zero exit status.
  const complete = new Promise((res, rej) => {
    gitProcess.on('exit', code => code ? gitError(null, code) : res(code));
    gitProcess.on('error', (err) => gitError(err));
    async function gitError(err, code) {
      rej(new GitError(dir, await stderrPromise, code));
    }
  });
  return {
    complete,
    stream: gitProcess.stdout
  };
}

export class GitError extends Error {
  constructor(repo, gitErrors, gitExitCode) {
    super();
    this.repositoryPath = repo;
    this.stderr = gitErrors;
    this.exitCode = gitExitCode;
  }
}