# Gitlogg

> _Parse the 'git log' of one or several 'git' repositories into a sanitised and distributable 'JSON' file._

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

![Success!](https://raw.githubusercontent.com/dreamyguy/gitlogg/master/docs/success.png "Success messages as on release v0.1.3")
> **Success!** `JSON` parsed, based on **7** different repositories with a total of **7375** commits.

![Error 001](https://raw.githubusercontent.com/dreamyguy/gitlogg/master/docs/error-001.png "'Error 001' message as on release v0.1.3")
> **Øh nøes!** The path to the folder containing all repositories *does not exist!*

![Error 002](https://raw.githubusercontent.com/dreamyguy/gitlogg/master/docs/error-002.png "'Error 002' message as on release v0.1.3")
> **Øh nøes!** The path to the folder containing all repositories *exists, but is empty!*

## Requirements

[NodeJS][2] and [BabelJS][3].

1. Install `NodeJS` (visit [their page][2] to find the right install for your system).
2. Install `BabelJS` globally by running `npm install babel-cli -g`. One can also choose to install it locally by simply running `npm install babel-cli`, but in most cases it is smarter to install `-cli` packages globally.
3. Run `npm install` to install the remaining dependencies.

## The `JSON` output

The output will look like this (first commit for **Font Awesome**):

    {
      "commits": [
        {
          "repository": "Font-Awesome",
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
          "time_hour": "09",
          "time_minutes": "27",
          "time_seconds": "26",
          "time_gmt": "-0500",
          "date_day_week": "Fri",
          "date_month_day": "17",
          "date_month_name": "Feb",
          "date_month_number": "02",
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
    }

Note that many `git log` fields were not printed here, but that's only because I've commented out some of them in the **gitlogg-parse-json.js** script. All the fields below are available. Fields marked with a `*` are either non-standard or not available as placeholders on `--pretty=format:<string>`:

    * repository
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

    .
    ├── gitlogg
    │   ├── gitlogg-generate-log.sh
    │   ├── gitlogg-parse-json.js
    │   └── gitlogg.sh
    └── repos         <== place/keep your repositories under the folder "repos"
        ├── repo1
        ├── repo2
        ├── repo3
        └── repo4

1. Copy the `gitlogg` folder and all its content to the indicated relative path to your local repositories (shown above).

2. Navigate to the `gitlogg` directory:

        $ cd path/to/the/folder/in/your/system/gitlogg/

3. Run it:

        $ ./gitlogg.sh

#### Advanced Mode

To generate the `JSON` file based on repositories in any other location, you'll have to define the path to the folder that contains all your repositories.

1. Copy the `gitlogg` folder and all its content to a folder of your preference, it really doesn't matter where it is.

2. Open `gitlogg.sh` with an editor of your choice and edit the `yourpath` variable:

        # define the absolute path to the directory that contains all your repositories
        yourpath=~/path/to/directory/that/contains/all/your/repositories/

3. Navigate to the `gitlogg` directory:

        $ cd path/to/the/folder/in/your/system/gitlogg/

4. Run it:

        $ ./gitlogg.sh

## The parsed `JSON` file

> _Two files will be generated at the `gitlogg` folder: `gitlogg.tmp` and `gitlogg.json`._

Two files were necessary because of the nature of the script, that loops through all subdirectories and outputs the `git log` for all valid `git` repositories. Once that loop is done, a valid `JSON` file (`gitlogg.json`) is generated out of `gitlogg.tmp`.

`gitlogg.tmp` is just a temporary file from which `gitlogg.json` bases itself on. In case the parsing fails `gitlogg.tmp` can come in handy for debugging.

## Further Notes

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

#### Release History

* 2016-05-23   [v0.1.4](https://github.com/dreamyguy/gitlogg/tree/v0.1.4)   Fix a bug that would break the output in some rare cases
* 2016-05-21   [v0.1.3](https://github.com/dreamyguy/gitlogg/tree/v0.1.3)   Even better error handling
* 2016-05-21   [v0.1.2](https://github.com/dreamyguy/gitlogg/tree/v0.1.2)   Better error handling
* 2016-05-21   [v0.1.1](https://github.com/dreamyguy/gitlogg/tree/v0.1.1)   The 'gitlogg' release, the node-based JSON generation
* 2016-05-20   [v0.1.0](https://github.com/dreamyguy/gitlogg/tree/v0.1.0)   The 'git-log-to-json' release, now considered legacy

-------------

> _Brought to you by [Wallace Sidhrée][1]._

  [1]: http://sidhree.com/ "Wallace Sidhrée"
  [2]: https://nodejs.org/en/ "NodeJS"
  [3]: https://babeljs.io/ "BabelJS"
