var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    {chunk} = require('lodash'),
    {fields: gitLogFields} = require('./git-log-fields'),
    // Read and write from file descriptors.  Bash script will hook these up.
    input_file = 3,
    output_file = 4;

try {
  require('source-map-support').install();
} catch(e) {}

console.log(chalk.yellow('Generating JSON output...'));

var changes = function(data, index) {
  var v = data.split(',')[index] || 0;
  var w = 0;
  if (v !== 0) {
    var w = v.split(' ')[1]; // the number of changes is second on the array
  }
  return parseInt(w);
};

console.time(chalk.green('JSON output generated in'));


const fields = [
  {identifier: 'repository'},
  ...gitLogFields,
  {identifier: 'shortstats'}
];

let input = fs.readFileSync(input_file, 'utf8').split('\0');
input.shift();
const totalFields = fields.length;
const inputCommits = chunk(input, totalFields);

const output = {};
inputCommits.forEach(item => {
    // The last field for each commit includes the trailing newline output by `git log`; remove it
    item[totalFields - 1] = item[totalFields - 1].slice(0, -1);

    const commit = {};
    fields.forEach((field, i) => {
      commit[field.identifier] = item[i];
    });
    const stats = commit.shortstats;
    commit.files_changed = changes(stats, 0);
    const insertions = commit.insertions = changes(stats, 1);
    const deletions = commit.deletions = changes(stats, 2);
    commit.impact = insertions - deletions;
    // TODO reimplement commit_nr

    const repository = commit.repository;
    output[repository] = output[repository] || [];
    output[repository].push(commit);
  });

console.timeEnd(chalk.green('JSON output generated in'));

console.log(chalk.yellow('Writing output to file...'));

fs.writeFileSync(output_file, JSON.stringify(output, null, 2));
