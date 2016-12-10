import * as fs from 'fs';
import * as Path from 'path';

import {chunk} from 'lodash';

import {fields as gitLogFields} from './git-log-fields';
import {yellow, green, reset} from './colors';
import {console} from './console';

const fields = [
  ...gitLogFields,
  {identifier: 'shortstats'}
];

function changes(data) {
  const vs = data.split(',');
  return {
    changes: p(0),
    insertions: p(1),
    deletions: p(2)
  };
  function p(index) {
    const v = vs[index] || 0;
    let w = 0;
    if (v !== 0) {
      w = v.split(' ')[1]; // the number of changes is second on the array
    }
    return parseInt(w);
  }
}

/**
 * Parse intermediate output from a *single* git repository into JSON
 */
export function parseToJson(rawInput, repoName) {

  console.log(`${ yellow }Generating JSON output...${ reset }`);

  console.time(`${ green }JSON output for ${ repoName } generated in${ reset }`);

  let input = rawInput.split('\0');
  input.shift();
  const totalFields = fields.length;
  const inputCommits = chunk(input, totalFields);

  const commits = inputCommits.map((item, index) => {
      // The last field for each commit includes the trailing newline output by `git log`; remove it
      item[totalFields - 1] = item[totalFields - 1].slice(0, -1);

      const commit = {};
      fields.forEach((field, i) => {
        commit[field.identifier] = item[i];
      });
      const stats = commit.shortstats;
      const commitChanges = changes(stats);
      commit.files_changed = commitChanges.changes;
      const insertions = commit.insertions = commitChanges.insertions;
      const deletions = commit.deletions = commitChanges.deletions;
      commit.impact = insertions - deletions;

      commit.commit_nr = index + 1;

      return commit;
    });

  console.timeEnd(`${ green }JSON output for ${ repoName } generated in${ reset }`);

  return commits;
}