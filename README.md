# Git log to JSON

> _A **study project** to parse **git log** as **JSON** - so that the git log is made available for JavaScript awesomeness._

#### The main goal

> _Render the `git log` of a `git` repository in a clean, ready-to-use `JSON` format._

#### The long-term goal

> _Expand from the main goal in a way that gives owners & administrators of several repositories a global overview over authors and their impact in all their repos + on each separate repository separately, if desired._

## Modes

There are currently two modes: **Single Git Repository** and **Multiple Git Repositories**.

In either mode, the `JSON` output gets parsed by running a shell script from terminal, which is then rendered to a file.

#### Single Git Repository

The single mode consists in running the `gitlog.sh` shell script from terminal. To run it:

1. Copy `gitlog.sh` to the root of your repository in whichever way you prefer.

2. Navigate to your repository's directory:

        $ cd path/to/repository/

3. Run it:

        $ ./gitlog.sh

> _A `gitlog.json` file will be generated at the root of your repository._

#### Multiple Git Repositories

The multiple mode consists in running the `gitlog_all.sh` shell script from terminal. This script can be run from any location, but you'll have to define the path to the folder that contains all your repositories. To run it:

1. Copy `gitlog_all.sh` to the folder of your preference.

2. Open `gitlog_all.sh` with an editor of your choice and edit the following line:

        # define the absolute path to the directory that contains all your repositories (the trailing asterix [/*] represents all the repository folders)
        yourpath=~/path/to/directory/that/contains/all/your/repositories/*/

2. Navigate to the directory that you copied the script to:

        $ cd path/to/script/

3. Run it:

        $ ./gitlog_all.sh

> _Two files will be generated at the folder your script is located. `gitlog_all.tmp` and `gitlog_all.json`._

Two files were necessary because of the nature of the script, that loops through all subdirectories and outputs the `git log` for all valid `git` repositories. Once that loop is done, a valid `JSON` file (`gitlog_all-json`) is generated out of `gitlog_all.tmp`.

## The JSON output

Depending on the mode you're using, the file that contain the parsed `git log` in `JSON` format will have two different names: `gitlog.json` or `gitlog_all.json`. These files can then be used to do all kind of funky JavaScript stuff. :beer:

#### JSON output for Single Git Repository

    {
        "commits":[
            {
                "commit_nr":"1",
                "commit_hash":"c7a397928f814f29028bccb281de60066395eaa1",
                (...)
                "impact":"4"
            },
            {
                "commit_nr":"2",
                "commit_hash":"ee3810c9ff8fe144c9ee58f48d99f59885f03462",
                (...)
                "impact":"481133"
            },
            {
                "commit_nr":"3",
                "commit_hash":"bc9a179663f00f134041ac750a56df8280e0b50b",
                (...)
                "impact":"68"
            }
        ]
    }


#### JSON output for Multiple Git Repositories

    {
        "commits":[
            {
                "repository":"grunt-contrib-csslint",
                "commit_nr":"1",
                "commit_hash":"f96abb1dab054b4b6a7c5364235b75fa01d4664d",
                (...)
                "impact":"356"
            },
            {
                "repository":"grunt-contrib-csslint",
                "commit_nr":"2",
                "commit_hash":"917d1efec749f2a1f2eb532f4af4a105baa3a10d",
                (...)
                "impact":"-44"
            },
            {
                "repository":"grunt-contrib-csslint",
                "commit_nr":"3",
                "commit_hash":"be42f23b64ded8c9e182d2e8b4774a1a584e071e",
                (...)
                "impact":"141"
            },
            {
                "repository":"grunt-contrib-htmlmin",
                "commit_nr":"1",
                "commit_hash":"989ef4dfd939efd168af2b16687d92ff4e9f9fff",
                (...)
                "impact":"240"
            },
            {
                "repository":"grunt-contrib-htmlmin",
                "commit_nr":"2",
                "commit_hash":"86c97d8c7429632d9773a03fc405fb8f46912bb4",
                (...)
                "impact":"349"
            },
            {
                "repository":"grunt-contrib-htmlmin",
                "commit_nr":"3",
                "commit_hash":"3da774dd78d28d07d56ee2cf53f766985e669261",
                (...)
                "impact":"-4"
            },
            {
                "repository":"grunt-lib-phantomjs",
                "commit_nr":"1",
                "commit_hash":"c999ca06a886bc1aad2d5dd9c88c808f5cf0a2b9",
                (...)
                "impact":"412"
            },
            {
                "repository":"grunt-lib-phantomjs",
                "commit_nr":"2",
                "commit_hash":"53c2ff150b75c110552a1623d541bdc737a0d4a0",
                (...)
                "impact":"12"
            },
            {
                "repository":"grunt-lib-phantomjs",
                "commit_nr":"3",
                "commit_hash":"682525b8287bb0285829a29d7c9851e879100a67",
                (...)
                "impact":"1"
            }
        ]
    }


## Further Notes

> #### Requirements

The project is being developed on **iTerm 1.0** and **Sublime Text 2** on **OSX Mountain Lion**.

I assume that **any text editor** and **terminal-equivalent** on an **UNIX system** would be up to the task, but don't know what it would take to get the same done in Windows OS. The commands used (so far) are pretty standard, but there you have it: I just don't know if it would work on Windows...

> #### Documentation

Since this project is really not that big deal, documentation is done either by:

* commit messages,
* commit comments,
* code comments.

Some of the initial commits were done deliberately to show what one gets with short commands like `$ git log`. From that initial state commits keep on introducing simplicity or complexity to the code, depending on the work flow. That in itself is a form of documentation. In other words, if you're really that interested in details, there are plenty to be had in the code itself and in its own progressive enhancement.

> #### License

This one ain't got no license! If you ever manage to dominate the world with this script, be my guest. Just gimme some credit when they ask who the hell came up with the idea... :earth_americas:

> #### Disclaimer

This project is by no means the smartest way to parse a `git log` to `JSON`, nor does it aim at becoming so. It is simply put a simple _learn-by-doing_ project in which I experiment with commands available on OSX's Terminal and whatever else I find along the way.

It's certainly not harmful to your repository and it won't change any data in it. Having said that, it's served _raw_ and with _'as is'_. **No support**, nada.

-------------

> _Brought to you by [Dreamyguy.com] [1], with the help of many other awesome internet dudes!_

  [1]: http://dreamyguy.com/        "Dreamyguy"
