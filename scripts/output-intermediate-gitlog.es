#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const chalk = require('chalk');
const which = require('which');
const {formatString} = require('./git-log-fields');

// Returns an intermediate representation of git log with the given repository to stdout
const dir = path.resolve(process.argv[2]);
const dirName = path.basename(dir);

fs.existsSync(dir) || process.exit(1);

console.error('Outputting ' + chalk.magenta(dirName));

childProcess.spawnSync(which.sync('git'), [
  '--no-pager', 'log', '--all', '--no-merges', '--shortstat', '--reverse',
  `--pretty=tformat:%x00${ dirName }%x00${ formatString }`
], {
  cwd: dir,
  stdio: 'inherit'
});