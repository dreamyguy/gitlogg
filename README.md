Git log to JSON
================================

_A **study project** to parse **git log** as **JSON** - so that the git log is made available for JavaScript awesomeness._

The main goal
-------------------------

_Render the `git log` of a `git` repository in a clean, ready-to-use `JSON` format._

The long-term goal
-------------------------

_Expand from the main goal in a way that gives owners & administrators of several repositories a global overview over authors and their impact in all their repos + on each separate repository separately, if desired._

The parser script
-------------------------

The way JSON gets parsed may change as the project evolves, but right now it gets parsed by running the `gitlog.sh` shell script from terminal. To run it:

1. Copy `gitlog.sh` to the root of your repository

2. Navigate to your repository's directory:

        $ cd path/to/repository/

3. Run it:

        $ ./gitlog.sh

The JSON output
-------------------------

Once you've run the parser script, a new file named `gitlog.json` will be generated in the root of your repository. That file will contain the parsed `git log` in `JSON` format. That file can then be used to do all kind of funky JavaScript stuff. :beer:

To illustrate the output of each version of `gitlog.sh`, I've outputted the `git log` from the `git` project itself, by running the script within the git repository and copying both `gitlog.sh` and `gitlog.sh` to `git-log-to-json` repository.

Note that as a way to document the progression of the `JSON` output based on the `gitlog.sh` script, 

Requirements
-------------------------

The project is being developed on **iTerm 1.0** and **Sublime Text 2** on **OSX Mountain Lion**.

I assume that **any text editor** and **terminal-equivalent** on an **UNIX system** would be up to the task, but don't know what it would take to get the same done in Windows OS. The commands used (so far) are pretty standard, but there you have it: I just don't know if it would work on Windows...

Documentation
-------------------------

Since this project is really not that big deal, documentation is done either by:

* commit messages,
* commit comments,
* code comments.

Some of the initial commits were done deliberately to show what one gets with short commands like `$ git log`. From that initial state commits keep on introducing simplicity or complexity to the code, depending on the work flow. That in itself is a form of documentation. In other words, if you're really that interested in details, there are plenty to be had in the code itself and in its own progressive enhancement.

License
-------------------------

This one ain't got no license! If you ever manage to dominate the world with this script, be my guest. Just gimme some credit when they ask who the hell came up with the idea... :earth_americas:

Disclaimer
-------------------------

This project is by no means the smartest way to parse a `git log` to `JSON`, nor does it aim at becoming so. It is simply put a simple _learn-by-doing_ project in which I experiment with commands available on OSX's Terminal and whatever else I find along the way.

It's certainly not harmful to your repository and it won't change any data in it. Having said that, it's served _raw_ and with _'as is'_. **No support**, nada.

_Brought to you by [Dreamyguy.com] [1] and many other awesome internet dudes!_

  [1]: http://dreamyguy.com/        "Dreamyguy"