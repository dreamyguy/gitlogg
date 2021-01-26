var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    byline = require('byline'),
    Transform = require('stream').Transform,
    JSONStream = require('JSONStream'),
    output_file_temp = '_tmp/gitlogg.tmp',
    output_file = '_output/gitlogg.json';

console.log(chalk.yellow('\n Parsing JSON output...\n'));

// initialise timer
console.time(chalk.green(' JSON output parsed in'));

// create the streams
var stream = fs.createReadStream(output_file_temp, 'utf8');
var output = fs.createWriteStream(output_file, 'utf8');
// handle errors
stream.on('error', function() {
  console.log(chalk.red(' Could not read from ' + output_file_temp));
});
output.on('error', function() {
  console.log(chalk.red(' Something went wrong, ' + output_file + ' could not be written / saved'));
});
// handle completion callback
output.on('finish', function() {
  console.timeEnd(chalk.green(' JSON output parsed in'));
  console.log(chalk.green(' The file ' + chalk.blue(output_file) + ' was saved. ' + chalk.yellow('Done! ✨\n')));
});

// stream the stream line by line
stream = byline.createStream(stream);
// create a transform stream
var parser = new Transform({ objectMode: true });
// use a JSONStream: JSONStream.stringify(open, sep, close)
var jsonToStrings = JSONStream.stringify('[\n  ', ',\n  ','\n]\n');

// output stats according to mode
const getStats = ({
  stats,
  mode, // 'files' | 'insertions' | 'deletions'
}) => {
  let output = 0;
  let rgx = /(.*)/gi;
  let match = '';
  if (stats) {
    if (mode === 'files') {
      rgx = /(?<filesChanged>[0-9]*)(\s)(files?\schanged)/gi;
      match = stats.match(rgx);
      output = match && match[0] ? match[0].replace(rgx, '$<filesChanged>') : 0;
    }
    if (mode === 'insertions') {
      rgx = /(?<insertions>[0-9]*)(\s)(insertions?\(\+\))/gi;
      match = stats.match(rgx);
      output = match && match[0] ? match[0].replace(rgx, '$<insertions>') : 0;
    }
    if (mode === 'deletions') {
      rgx = /(?<deletions>[0-9]*)(\s)(deletions?\(\-\))/gi;
      match = stats.match(rgx);
      output = match && match[0] ? match[0].replace(rgx, '$<deletions>') : 0;
    }
  }
  return output ? parseInt(output, 10) : 0;
};

// decode UTF-8-ized Latin-1/ISO-8859-1 to UTF-8
var decode = function(str) {
  var s;
  try {
    // if the string is UTF-8, this will work and not throw an error.
    s = decodeURIComponent(escape(str));
  } catch(e) {
    // if it isn't, an error will be thrown, and we can asume that we have an ISO string.
    s = str;
  }
  return s;
};

// replace double quotes with single ones
var unquote = function(str) {
  if (str === undefined) {
    return '';
  } else if (str != '') {
    return str.replace(/"/g, "'");
  } else {
    return str;
  }
};

// slice the string as long as it's not empty
var sliceit = function(str) {
  if (str === undefined) {
    return '';
  } else if (str != '') {
    return str.slice(1);
  } else {
    return str;
  }
}

// do the transformations, through the transform stream
parser._transform = function(data, encoding, done) {
  var separator = /\\t/;
  var dataDecoded = decode(data);
  var c = dataDecoded.trim().split(separator);
  // console.log(c);
  // vars based on sequential values ( sanitise " to ' on fields that accept user input )
  var repository =                     c[3],                    // color-consolidator
      commit_nr =                      parseInt(c[0], 10),      // 3
      commit_hash =                    c[5],                    // 5109ad5a394a4873290ff7f7a38b7ca2e1b3b8e1
      commit_hash_abbreviated =        c[7],                    // 5109ad5
      tree_hash =                      c[9],                    // a1606ea8d6e24e1c832b52cb9c04ae1df2242ed4
      tree_hash_abbreviated =          c[11],                   // a1606ea
      parent_hashes =                  c[13],                   // 7082fa621bf93503fe173d06ada3c6111054a62b
      parent_hashes_abbreviated =      c[15],                   // 7082fa6
      author_name =                    unquote(c[17]),          // Wallace Sidhrée
      author_name_mailmap =            unquote(c[19]),          // Wallace Sidhrée
      author_email =                   c[21],                   // i@dreamyguy.com
      author_email_mailmap =           c[23],                   // i@dreamyguy.com
      author_date =                    c[25],                   // Fri Jan 3 14:16:56 2014 +0100
      author_date_RFC2822 =            c[27],                   // Fri, 3 Jan 2014 14:16:56 +0100
      author_date_relative =           c[29],                   // 2 years, 5 months ago
      author_date_unix_timestamp =     c[31],                   // 1388755016
      author_date_iso_8601 =           c[33],                   // 2014-01-03 14:16:56 +0100
      author_date_iso_8601_strict =    c[35],                   // 2014-01-03T14:16:56+01:00
      committer_name =                 unquote(c[37]),          // Wallace Sidhrée
      committer_name_mailmap =         unquote(c[39]),          // Wallace Sidhrée
      committer_email =                c[41],                   // i@dreamyguy.com
      committer_email_mailmap =        c[43],                   // i@dreamyguy.com
      committer_date =                 c[45],                   // Fri Jan 3 14:16:56 2014 +0100
      committer_date_RFC2822 =         c[47],                   // Fri, 3 Jan 2014 14:16:56 +0100
      committer_date_relative =        c[49],                   // 2 years, 5 months ago
      committer_date_unix_timestamp =  c[51],                   // 1388755016
      committer_date_iso_8601 =        c[53],                   // 2014-01-03 14:16:56 +0100
      committer_date_iso_8601_strict = c[55],                   // 2014-01-03T14:16:56+01:00
      ref_names =                      unquote(c[57]),          // ""
      ref_names_no_wrapping =          unquote(c[59]),          // ""
      encoding =                       c[61],                   // ""
      subject =                        unquote(c[63]),          // Upgrade FontAwesome from 3.2.1 to 4.0.3"
      subject_sanitized =              c[65],                   // Upgrade-FontAwesome-from-3.2.1-to-4.0.3"
      commit_notes =                   unquote(c[67]),          // ""
      stats =                          sliceit(c[69]);          // ` 9 files changed, 507 insertions(+), 2102 deletions(-)`
  // vars that require manipulation
  var time_array =                     author_date.split(' '),                  // Fri Jan 3 14:16:56 2014 +0100 => [Fri, Jan, 3, 14:16:56, 2014, +0100]
      time_array_clock =               time_array[3].split(':'),                // 14:16:56 => [14, 16, 56]
      time_hour =                      parseInt(time_array_clock[0], 10),       // [14, 16, 56] => 14
      time_minutes =                   parseInt(time_array_clock[1], 10),       // [14, 16, 56] => 16
      time_seconds =                   parseInt(time_array_clock[2], 10),       // [14, 16, 56] => 56
      time_gmt =                       time_array[5],                           // [Fri, Jan, 3, 14:16:56, 2014, +0100] => +0100
      date_array =                     author_date_iso_8601.split(' ')[0],      // 2014-01-03 14:16:56 +0100 => 2014-01-03
      date_day_week =                  time_array[0],                           // [Fri, Jan, 3, 14:16:56, 2014, +0100] => Fri
      date_iso_8601 =                  date_array,                              // 2014-01-03
      date_month_day =                 parseInt(date_array.split('-')[2], 10),  // 2014-01-03 => [2014, 01, 03] => 03
      date_month_name =                time_array[1],                           // [Fri, Jan, 3, 14:16:56, 2014, +0100] => Jan
      date_month_number =              parseInt(date_array.split('-')[1], 10),  // 2014-01-03 => [2014, 01, 03] => 01
      date_year =                      time_array[4],                           // [Fri, Jan, 3, 14:16:56, 2014, +0100] => 2014
      files_changed =                  getStats({ stats, mode: 'files' }),      // ` 9 files changed, 507 insertions(+), 2102 deletions(-)` => 9
      insertions =                     getStats({ stats, mode: 'insertions' }), // ` 9 files changed, 507 insertions(+), 2102 deletions(-)` => 507
      deletions =                      getStats({ stats, mode: 'deletions' }),  // ` 9 files changed, 507 insertions(+), 2102 deletions(-)` => 2102
      impact =                         (insertions - deletions);                // 507 - 2102 => -1595
  // create the object
  var obj = {
      repository: repository,
      commit_nr: commit_nr,
      commit_hash: commit_hash,
      // commit_hash_abbreviated: commit_hash_abbreviated,
      // tree_hash: tree_hash,
      // tree_hash_abbreviated: tree_hash_abbreviated,
      // parent_hashes: parent_hashes,
      // parent_hashes_abbreviated: parent_hashes_abbreviated,
      author_name: author_name,
      // author_name_mailmap: author_name_mailmap,
      author_email: author_email,
      // author_email_mailmap: author_email_mailmap,
      author_date: author_date,
      // author_date_RFC2822: author_date_RFC2822,
      author_date_relative: author_date_relative,
      author_date_unix_timestamp: author_date_unix_timestamp,
      author_date_iso_8601: author_date_iso_8601,
      // author_date_iso_8601_strict: author_date_iso_8601_strict,
      // committer_name: committer_name,
      // committer_name_mailmap: committer_name_mailmap,
      // committer_email: committer_email,
      // committer_email_mailmap: committer_email_mailmap,
      // committer_date: committer_date,
      // committer_date_RFC2822: committer_date_RFC2822,
      // committer_date_relative: committer_date_relative,
      // committer_date_unix_timestamp: committer_date_unix_timestamp,
      // committer_date_iso_8601: committer_date_iso_8601,
      // committer_date_iso_8601_strict: committer_date_iso_8601_strict,
      // ref_names: ref_names,
      // ref_names_no_wrapping: ref_names_no_wrapping,
      // encoding: encoding,
      subject: subject,
      subject_sanitized: subject_sanitized,
      // commit_notes: commit_notes,
      stats: stats,
      time_hour: time_hour,
      time_minutes: time_minutes,
      time_seconds: time_seconds,
      time_gmt: time_gmt,
      date_day_week: date_day_week,
      date_month_day: date_month_day,
      date_month_name: date_month_name,
      date_month_number: date_month_number,
      date_year: date_year,
      date_iso_8601: date_iso_8601,
      files_changed: files_changed,
      insertions: insertions,
      deletions: deletions,
      impact: impact
  };
  this.push(obj);
  done();
};

// initialise stream
stream
.pipe(parser)
.pipe(jsonToStrings)
.pipe(output);
