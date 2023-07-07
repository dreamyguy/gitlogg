![Gitlogg](https://raw.githubusercontent.com/dreamyguy/gitlogg/master/docs/gitlogg-icon-github.png "Parse the 'git log' of one or several 'git' repositories into a sanitised and distributable 'JSON' file")

> _Parse the 'git log' of one or several 'git' repositories into a sanitised and distributable 'JSON' file._

[![MIT Licence](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dreamyguy/gitlogg/blob/master/LICENSE) [![Data served by Gitlogg API](https://img.shields.io/badge/data_can_be_served_by-gitlogg--api-89336e.svg)](https://github.com/dreamyguy/gitlogg-api) [![Data served by Gitlogg API](https://img.shields.io/badge/data_can_be_rendered_by-gitinsight-89336e.svg)](https://github.com/dreamyguy/gitinsight)

## Why?

`git log` is a wonderful tool. However its output can be not only surprisingly inconsistent, but also long, difficult to scan and to distribute.

**Gitlogg** sanitises the `git log` and outputs it to `JSON`, a format that can easily be consumed by other applications. As long as the repositories being scanned are kept up to date, **Gitlogg** will return fresh data every time it runs.

#### **Gitlogg** addresses the following challenges:

* `git log` can only be used on a repository at a time.
* `git log` can't be easily consumed by other applications in its original format.
* `git log` doesn't return **impact**, which is the cumulative change brought by a single commit. Very interesting graphs can be built with that data, as shown on [sidhree.com][1].
* Fields that allow user input, like `subject`, need to be sanitised to be consumed.
* File changes shown under `--stat` or `--shortstat` are currently not available as placeholders under `--pretty=format:<string>`, and it is cumbersome to get commit logs to output neatly in single lines - with stats.
* It is hard to retrieve commits made on a specific but generic moment, like "11pm"; at the "27th minute" of an hour; on a "Sunday"; on "March"; on "GMT -5"; on the "53rd second of a minute".
* Some commits don't have stats, and that can cause the structure of the output to break, making it harder to distribute it.

#### Script execution feedback

**Gitlogg** is not a very complex application, but I still made an effort to provide some feedback on what is happening under the hood. Below are some screenshots of dialogs one can expect to see while executing it:

![Error 001](https://raw.githubusercontent.com/dreamyguy/gitlogg/master/docs/error-001.png "'Error 001' message as on release v0.1.3")
> **Øh nøes!** The path to the folder containing all repositories *does not exist!*

![Error 002](https://raw.githubusercontent.com/dreamyguy/gitlogg/master/docs/error-002.png "'Error 002' message as on release v0.1.3")
> **Øh nøes!** The path to the folder containing all repositories *exists, but is empty!*

![Success!](https://raw.githubusercontent.com/dreamyguy/gitlogg/master/docs/success.png "Success messages as on release v0.1.6")
> **Success!** `JSON` parsed, based on **9** different repositories with a total of **25,537** commits.

Note that I've included two huge repos _(*react* & *react-native*, that have 7,813 & 10,065 commits respectively at the time of this writting)_ for the sake of demonstration. The resulting parsed `JSON` file has 715,040 lines. All that done in less than 25 seconds.

_I have successfully compiled **`470`** repositories at once_ (all repos under the organization I work for). Then I got these specs:

* `gitlogg.tmp` generated in `154s` (`~2.57mins`)
* `JSON` output parsed in `2792ms`
* `JSON` file size: `121,5MB`
* Commits processed: `118,117`
* Parsed `JSON` file, lines: `3,307,280`

## Getting started

**Gitlogg** requires [NodeJS][2] and [BabelJS][3].

1. Install `NodeJS` (visit [their page][2] to find the right install for your system).
2. Run `npm run setup`. That will:

* Install `BabelJS` globally by running `npm install babel-cli -g`.
* Install all the local dependencies, through `npm install`.
* Create the directory in which all repos to be parsed to `JSON` will be at (only on **Simple Mode**).
* Create the directories expected by the scripts that output files.

## The `JSON` output

The output will look like this (first commit for **Font Awesome**):

    [
      {
        "repository": "Font-Awesome",
        "commit_nr": 1,
        "commit_hash": "7ed221e28df1745a20009329033ac690ef000575",
        "author_name": "Dave Gandy",
        "author_email": "dave@davegandy.com",
        "author_date": "Fri Feb 17 09:27:26 2012 -0500",
        "author_date_relative": "4 years, 3 months ago",
        "author_date_unix_timestamp": "1329488846",
        "author_date_iso_8601": "2012-02-17 09:27:26 -0500",
        "subject": "first commit",
        "subject_sanitized": "first-commit",
        "stats": " 1 file changed, 0 insertions(+), 0 deletions(-)",
        "time_hour": 9,
        "time_minutes": 27,
        "time_seconds": 26,
        "time_gmt": "-0500",
        "date_day_week": "Fri",
        "date_month_day": 17,
        "date_month_name": "Feb",
        "date_month_number": 2,
        "date_year": "2012",
        "date_iso_8601": "2012-02-17",
        "files_changed": 1,
        "insertions": 0,
        "deletions": 0,
        "impact": 0
      },
      {
        (...)
      },
      {
        (...)
      }
    ]

Note that many `git log` fields were not printed here, but that's only because I've commented out some of them in the **gitlogg-parse-json.js** script. All the fields below are available. Fields marked with a `*` are either non-standard or not available as placeholders on `--pretty=format:<string>`:

    * repository
    * commit_nr
      commit_hash
      commit_hash_abbreviated
      tree_hash
      tree_hash_abbreviated
      parent_hashes
      parent_hashes_abbreviated
      author_name
      author_name_mailmap
      author_email
      author_email_mailmap
      author_date
      author_date_RFC2822
      author_date_relative
      author_date_unix_timestamp
      author_date_iso_8601
      author_date_iso_8601_strict
      committer_name
      committer_name_mailmap
      committer_email
      committer_email_mailmap
      committer_date
      committer_date_RFC2822
      committer_date_relative
      committer_date_unix_timestamp
      committer_date_iso_8601
      committer_date_iso_8601_strict
      ref_names
      ref_names_no_wrapping
      encoding
      subject
      subject_sanitized
      commit_notes
    * stats
    * time_hour
    * time_minutes
    * time_seconds
    * time_gmt
    * date_day_week
    * date_month_day
    * date_month_name
    * date_month_number
    * date_year
    * date_iso_8601
    * files_changed
    * insertions
    * deletions
    * impact

## Creating the `JSON` file

There are two modes and they are basically the same, except that the **Simple Mode** doesn't require configuration. The **Advanced Mode** requires one to set the absolute path to the directory containing all the repositories you'd like to parse to a single `JSON` file.

#### Simple Mode

To simplify the generation process to a point that no configuration is required, follow this directory structure:

    gitlogg/          <== This repository's root
    ├── scripts/
    │   ├── colors.sh
    │   ├── gitlogg-generate-log.sh
    │   ├── gitlogg-parse-json.js
    │   └── gitlogg.sh
    └── _repos/       <== Copy/place/keep your repositories under the folder "_repos/"
        ├── repo1
        ├── repo2
        ├── repo3
        └── repo4

1. Copy the all the repositories you wish to parse to `JSON` to the `_repos/` folder, as shown above.

2. Granted that you are within the `gitlogg` folder (this repo's root), run:

        $ npm run gitlogg

#### Advanced Mode

To generate the `JSON` file based on repositories in any other location, you'll have to define the path to the folder that contains all your repositories.

1. Open [`gitlogg-generate-log.sh`](https://github.com/dreamyguy/gitlogg/blob/master/scripts/gitlogg-generate-log.sh#L4) with an editor of your choice and edit the `yourpath` variable:

        # define the absolute path to the directory that contains all your repositories
        yourpath=/absolute/system/path/to/directory/that/contains/all/your/repositories/

_**Tip:** drag the folder that contain your repositories to a terminal window, and you'll get the absolute system path to that folder._

2. Granted that you are within the `gitlogg` folder (this repo's root), run:

        $ npm run gitlogg

### Other Advanced Mode
1. Install dependencies
2. run `yarn gitloggs --  -[s|u|q|y] <path/of/the/repo>`
#### Args to `gitloggs`:
- s (for since date): is the since date to git log
- u (for until date): is the until date to git log
- q (for quarter): is the quarter of year
- y (for year): is the year to use, default id current year
#### Examples:
```yarn gitloggs -- -q 3 <path/of/the/repo>```
```yarn gitloggs -- -y 2022 -q 2 <path/of/the/repo>```
```yarn gitloggs -- -s 'Jan 1 2023' -u 'Mar 30 2023' <path/of/the/repo>```


#### Parallel Processing

The parallel processing that was released on [v0.1.8](https://github.com/dreamyguy/gitlogg/tree/v0.1.8) had problems with `xargs` and was temporarily removed. The issue is being dealt with through [pull-request #16](https://github.com/dreamyguy/gitlogg/pull/16).

## The parsed `JSON` file

> Two files will be generated when running `npm run gitlogg`: **`_tmp/gitlogg.tmp`** and **`_output/gitlogg.json`**.

    gitlogg/                <== This repository's root
    ├── scripts/
    │   ├── colors.sh
    │   ├── gitlogg-generate-log.sh
    │   ├── gitlogg-parse-json.js
    │   └── gitlogg.sh
    ├── _output/
    │   └── gitlogg.json    <== The parsed 'JSON', what we're all after. It's parsed from 'gitlogg.tmp'
    └── _tmp/
        └── gitlogg.tmp     <== The processed 'git log'

Two files were necessary because of the nature of the script, that loops through all subdirectories and outputs the `git log` for all valid `git` repositories. Once that loop is done, a valid `JSON` file (`gitlogg.json`) is generated out of `gitlogg.tmp`.

`gitlogg.tmp` is just a temporary file from which `gitlogg.json` bases itself on. In case the parsing fails `gitlogg.tmp` can come in handy for debugging.

## Further Notes

#### Debugging

I've created error messages with suggested solutions, to help you get past the most common issues.

However, `git log`'s output can break while it's being processed. That's most certainly caused by fields that allow user input, like _commit messages_. These fields may contain characters (like `\r`) that crash with those reserved for the generation of `gitlogg.tmp`, namely `\n`.

Efforts have been made to mitigate errors by sanitizing characters that have caused errors before, but it might still happen in some edge cases. If it does happen, have a look at the generated `gitlogg.tmp` and see if the expected structure (which is obvious) breaks. Once you have identified the line, have a closer look at the commit and look for an unusual character.

Post an issue with a link to a _gist_ containing your broken `gitlogg.tmp` and I will try to reproduce the error.

#### Documentation

Documentation is done either by:

* Commit messages,
* Commit comments,
* Code comments,
* `README.md` files, like this one.

Some of the initial commits were done deliberately to show what one gets with short commands like `$ git log`. From that initial state commits keep on introducing simplicity or complexity to the code, depending on the work flow. That in itself is a form of documentation. In other words, if you're really that interested in details, there are plenty to be had in the code itself and in its own progressive enhancement.

#### License

[MIT](LICENSE)

#### Disclaimer

This project is by no means the smartest way to parse a `git log` to `JSON`, nor does it aim at becoming so. It is simply a _learn-by-doing_ project in which I experiment with commands available on OSX's Terminal and whatever else I find along the way.

**Gitlogg** was built and tested on OSX. Though an effort has been done to make it cross-platform, there could be errors on other systems.

It's certainly not harmful to your repositories and it won't change any data in it. Having said that, it's served _raw_ and _'as is'_. You may get support, but don't expect it nor take it for granted.

#### Known Issues

There are _no known issues_ at this point. The parallelization that was introduced on [v0.1.8](https://github.com/dreamyguy/gitlogg/tree/v0.1.8) had issues with `xargs`, so its introduction was temporarily reverted until the problem has been dealt with through [pull-request #16](https://github.com/dreamyguy/gitlogg/pull/16). [v0.1.9](https://github.com/dreamyguy/gitlogg/tree/v0.1.9) was released to revert those changes.

The [javascript](https://github.com/dreamyguy/gitlogg/tree/javascript) branch is a very fine piece of programming; you should definitely check it out. I haven't tested it extensively, but found a few issues, which are reported in the [issue tracker](https://github.com/dreamyguy/gitlogg/issues).

The current version [v0.2.1](https://github.com/dreamyguy/gitlogg/tree/v0.2.1) is still quite stable after all these years, with no known issues. Try it! :sparkles:

#### Release History

* 2018-07-12   [v0.2.1](https://github.com/dreamyguy/gitlogg/tree/v0.2.1) - [View Changes](https://github.com/dreamyguy/gitlogg/compare/v0.2.0...v0.2.1)
  * Use `ȝ` instead of `\0` when replacing `\n` during the extraction of `git log`. `\0` is not as reliable as it seemed.
    * The main idea here is to use a character that occurs as seldom as possible - preferably never in `git` context.
    * `ȝ` (Yogh) is an old English character. If that gives problems, I'll try `ƿ` (Wynn), another abandoned English char.
* 2018-07-11   [v0.2.0](https://github.com/dreamyguy/gitlogg/tree/v0.2.0) - [View Changes](https://github.com/dreamyguy/gitlogg/compare/v0.1.9...v0.2.0)
  * Improve console output readability
  * Simplify `JSON` format.
    * Reduce filesize of output `JSON`, in some scenarios quite dramatically
    * Make it importable into `MongoDB`, which is what is being used on **gitlogg-api**
  * Use `\0` instead of `ò` when replacing `\n` during the extraction of `git log`.
    * The main idea here is to use a character that occurs as seldom as possible - preferably never in `git` context.
* 2016-12-15   [v0.1.9](https://github.com/dreamyguy/gitlogg/tree/v0.1.9) - [View Changes](https://github.com/dreamyguy/gitlogg/compare/v0.1.8...v0.1.9)
  * Remove parallelization of processes until the problem with `xargs` has been dealt with.
* 2016-12-14   [v0.1.8](https://github.com/dreamyguy/gitlogg/tree/v0.1.8) - [View Changes](https://github.com/dreamyguy/gitlogg/compare/v0.1.7...v0.1.8)
  * Parse `JSON` through a read/write stream, so we get around the 268MB `Node`'s buffer limitation.
    * This limited the whole operation to a number between 173,500 and 174,000 commits.
  * Parallelize the generation of `git log` for multiple repos, optionally passing number of processes as a CLI argument.
  * Mitigate encoding problems caused by `ISO-8859-1` characters not being properly encoded to `UTF-8`.
* 2016-11-21   [v0.1.7](https://github.com/dreamyguy/gitlogg/tree/v0.1.7) - [View Changes](https://github.com/dreamyguy/gitlogg/compare/v0.1.6...v0.1.7)
  * Better readability for 'Release History'
  * Correct url to logo, so it also renders outside Github
  * Rename sub-folder 'gitlogg' to 'scripts' to avoid confusion
  * Simplify initial setup and running of 'gitlogg'
  * Set vars instead of hardcoding values
  * Separate scripts from output files
  * Introduce 'Debugging' as a 'Further Notes' item
  * Tip on how to get the absolute system path to a directory
  * Introduce 'View Changes' links under 'Release History'
* 2016-11-19   [v0.1.6](https://github.com/dreamyguy/gitlogg/tree/v0.1.6) - [View Changes](https://github.com/dreamyguy/gitlogg/compare/v0.1.5...v0.1.6)
  * Introduce `commit_nr`, a commit count within each repo
  * Show how many repos are about to be processed on console
  * Show what repo is being processed on console
  * Replace carriage return with space
* 2016-06-12   [v0.1.5](https://github.com/dreamyguy/gitlogg/tree/v0.1.5) - [View Changes](https://github.com/dreamyguy/gitlogg/compare/v0.1.4...v0.1.5)
  * Introduce logo
  * Correct wrong reference to 'yourpath'
  * Output numbers instead of strings
* 2016-05-23   [v0.1.4](https://github.com/dreamyguy/gitlogg/tree/v0.1.4) - [View Changes](https://github.com/dreamyguy/gitlogg/compare/v0.1.3...v0.1.4)
  * Fix a bug that would break the output in some rare cases
* 2016-05-21   [v0.1.3](https://github.com/dreamyguy/gitlogg/tree/v0.1.3) - [View Changes](https://github.com/dreamyguy/gitlogg/compare/v0.1.2...v0.1.3)
  * Even better error handling
* 2016-05-21   [v0.1.2](https://github.com/dreamyguy/gitlogg/tree/v0.1.2) - [View Changes](https://github.com/dreamyguy/gitlogg/compare/v0.1.1...v0.1.2)
  * Better error handling
* 2016-05-21   [v0.1.1](https://github.com/dreamyguy/gitlogg/tree/v0.1.1) - [View Changes](https://github.com/dreamyguy/gitlogg/compare/v0.1.0...v0.1.1)
  * The 'gitlogg' release, the node-based JSON generation
* 2016-05-20   [v0.1.0](https://github.com/dreamyguy/gitlogg/tree/v0.1.0)
  * The 'git-log-to-json' release, now considered legacy

-------------

> _Brought to you by [Wallace Sidhrée][1]._

  [1]: http://sidhree.com/ "Wallace Sidhrée"
  [2]: https://nodejs.org/en/ "NodeJS"
  [3]: https://babeljs.io/ "BabelJS"
