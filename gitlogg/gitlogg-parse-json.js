var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    output_file = './gitlogg.json';

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

var output = fs.readFileSync('gitlogg.tmp', 'utf8')
  .trim()
  .split('\n')
  .map(line => line.split('\\t'))
  .reduce((commits, item) => {

    // vars based on sequential values ( sanitise " to ' on fields that accept user input )
    var repository =                     item[2],                            // color-consolidator
        commit_hash =                    item[4],                            // 5109ad5a394a4873290ff7f7a38b7ca2e1b3b8e1
        commit_hash_abbreviated =        item[6],                            // 5109ad5
        tree_hash =                      item[8],                            // a1606ea8d6e24e1c832b52cb9c04ae1df2242ed4
        tree_hash_abbreviated =          item[10],                           // a1606ea
        parent_hashes =                  item[12],                           // 7082fa621bf93503fe173d06ada3c6111054a62b
        parent_hashes_abbreviated =      item[14],                           // 7082fa6
        author_name =                    item[16].replace(/"/g, "'"),        // Wallace Sidhrée
        author_name_mailmap =            item[18],                           // Wallace Sidhrée
        author_email =                   item[20],                           // i@dreamyguy.com
        author_email_mailmap =           item[22],                           // i@dreamyguy.com
        author_date =                    item[24],                           // Fri Jan 3 14:16:56 2014 +0100
        author_date_RFC2822 =            item[26],                           // Fri, 3 Jan 2014 14:16:56 +0100
        author_date_relative =           item[28],                           // 2 years, 5 months ago
        author_date_unix_timestamp =     item[30],                           // 1388755016
        author_date_iso_8601 =           item[32],                           // 2014-01-03 14:16:56 +0100
        author_date_iso_8601_strict =    item[34],                           // 2014-01-03T14:16:56+01:00
        committer_name =                 item[36].replace(/"/g, "'"),        // Wallace Sidhrée
        committer_name_mailmap =         item[38],                           // Wallace Sidhrée
        committer_email =                item[40],                           // i@dreamyguy.com
        committer_email_mailmap =        item[42],                           // i@dreamyguy.com
        committer_date =                 item[44],                           // Fri Jan 3 14:16:56 2014 +0100
        committer_date_RFC2822 =         item[46],                           // Fri, 3 Jan 2014 14:16:56 +0100
        committer_date_relative =        item[48],                           // 2 years, 5 months ago
        committer_date_unix_timestamp =  item[50],                           // 1388755016
        committer_date_iso_8601 =        item[52],                           // 2014-01-03 14:16:56 +0100
        committer_date_iso_8601_strict = item[54],                           // 2014-01-03T14:16:56+01:00
        ref_names =                      item[56].replace(/"/g, "'"),        // ""
        ref_names_no_wrapping =          item[58].replace(/"/g, "'"),        // ""
        encoding =                       item[60],                           // ""
        subject =                        item[62].replace(/"/g, "'"),        // Upgrade FontAwesome from 3.2.1 to 4.0.3"
        subject_sanitized =              item[64],                           // Upgrade-FontAwesome-from-3.2.1-to-4.0.3"
        commit_notes =                   item[66].replace(/"/g, "'"),        // ""
        stats =                          item[68].slice(1);                  // ` 9 files changed, 507 insertions(+), 2102 deletions(-)`
    // vars that require manipulation
    var time_array =                     author_date.split(' '),             // Fri Jan 3 14:16:56 2014 +0100 => [Fri, Jan, 3, 14:16:56, 2014, +0100]
        time_array_clock =               time_array[3].split(':'),           // 14:16:56 => [14, 16, 56]
        time_hour =                      time_array_clock[0],                // [14, 16, 56] => 14
        time_minutes =                   time_array_clock[1],                // [14, 16, 56] => 16
        time_seconds =                   time_array_clock[2],                // [14, 16, 56] => 56
        time_gmt =                       time_array[5],                      // [Fri, Jan, 3, 14:16:56, 2014, +0100] => +0100
        date_array =                     author_date_iso_8601.split(' ')[0], // 2014-01-03 14:16:56 +0100 => 2014-01-03
        date_day_week =                  time_array[0],                      // [Fri, Jan, 3, 14:16:56, 2014, +0100] => Fri
        date_iso_8601 =                  date_array,                         // 2014-01-03
        date_month_day =                 date_array.split('-')[2],           // 2014-01-03 => [2014, 01, 03] => 03
        date_month_name =                time_array[1],                      // [Fri, Jan, 3, 14:16:56, 2014, +0100] => Jan
        date_month_number =              date_array.split('-')[1],           // 2014-01-03 => [2014, 01, 03] => 01
        date_year =                      time_array[4],                      // [Fri, Jan, 3, 14:16:56, 2014, +0100] => 2014
        files_changed =                  changes(stats, 0),                  // ` 9 files changed, 507 insertions(+), 2102 deletions(-)` => 9
        insertions =                     changes(stats, 1),                  // ` 9 files changed, 507 insertions(+), 2102 deletions(-)` => 507
        deletions =                      changes(stats, 2),                  // ` 9 files changed, 507 insertions(+), 2102 deletions(-)` => 2102
        impact =                         (insertions - deletions);           // 507 - 2102 => -1595

    commits[item[0]] = commits[item[0]] || [];
    commits[item[0]].push({
      repository: repository,
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
    });
    return commits;
  }, {});

console.timeEnd(chalk.green('JSON output generated in'));

console.log(chalk.yellow('Writing output to file...'));

// console.log('output', JSON.stringify(output, null, 2)) // comment this out to see the output on the terminal as well

fs.writeFile(output_file, JSON.stringify(output, null, 2), function(err) {
    if(err) {
        return console.log(chalk.red(err, 'Something went wrong, the file could not be written / saved'));
    }
    console.log(chalk.green('The file ' + chalk.blue(output_file) + ' was saved! '));
});
