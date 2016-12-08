import * as fs from 'fs';
import * as Path from 'path';
import * as StreamSplit from 'stream-split';

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
export function parseToJson(inputStream, repoName) {

  console.log(`${ yellow }Generating JSON output...${ reset }`);

  console.time(`${ green }JSON output for ${ repoName } generated in${ reset }`);

  const totalFields = fields.length;

  // Split the input on null bytes
  const splitter = new StreamSplit(new Buffer([0]), {
    // Pass all buffer, even the zero-length ones
    readableObjectMode: true
  });
  inputStream.pipe(splitter);
  // Skip leading null byte
  splitter.once('data', () => {
    splitter.on('data', onData);
  });
  const commits = [];
  let item = [];
  let commitIndex = 0;
  let fieldIndex = 0;
  function onData(field) {
    item[fieldIndex++] = field.toString('utf8');
    // If we've received a full commit's worth of fields, parse it
    if(fieldIndex === totalFields) {
      commits.push(parseCommit(item, commitIndex++));
      fieldIndex = 0;
    }
  }

  // Parse a commit from an array of fields
  function parseCommit(item, index) {
      // The last field for each commit includes the trailing newline output by `git log`; remove it
      item[totalFields - 1] = item[totalFields - 1].slice(0, -1);

      const commit = {
        repository: repoName,
        commit_nr: index + 1
      };
      fields.forEach((field, i) => {
        commit[field.identifier] = item[i];
      });
      const stats = commit.shortstats;
      const commitChanges = changes(stats);
      commit.files_changed = commitChanges.changes;
      const insertions = commit.insertions = commitChanges.insertions;
      const deletions = commit.deletions = commitChanges.deletions;
      commit.impact = insertions - deletions;

      // Perform more normalization and cleanup of fields
      commit.shortstats = commit.shortstats.trim();
      commit.parent_hashes = delimitedArray(commit.parent_hashes, ' ');
      commit.parent_hashes_abbreviated = delimitedArray(commit.parent_hashes_abbreviated, ' ');
      commit.ref_names = delimitedArray(commit.ref_names, ', ');
      if(!commit.encoding.length) commit.encoding = undefined;
      if(!commit.commit_notes.length) commit.commit_notes = undefined;
      // If commit is not signed
      if(commit.signature_validity === 'N') {
        commit.raw_GPG_verification_message = undefined;
        commit.signer_name = undefined;
        commit.key = undefined;
      }

      return commit;
  }

  // Wait for the stream to finish
  const commitsPromise = new Promise((res, rej) => {
    splitter.on('finish', () => {
      console.timeEnd(`${ green }JSON output for ${ repoName } generated in${ reset }`);
      res(commits);
    });
  });

  return {
    commits: commitsPromise
  };
}

function delimitedArray(field, delim) {
  return field.length ? field.split(delim) : [];
}
