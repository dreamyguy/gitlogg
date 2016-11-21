#!/bin/bash

# Returns an intermediate representation of git log with the given repository to stdout

source "colors.sh"

test "$1" || exit 1
dir=$1

cd $dir &&
        echo -e "${Whi}Outputting ${Pur}${PWD##*/}${RCol}" >&2 &&
        git log --all --no-merges --shortstat --reverse --pretty=format:'commits\trepository\t'"${PWD##*/}"'\tcommit_hash\t%H\tcommit_hash_abbreviated\t%h\ttree_hash\t%T\ttree_hash_abbreviated\t%t\tparent_hashes\t%P\tparent_hashes_abbreviated\t%p\tauthor_name\t%an\tauthor_name_mailmap\t%aN\tauthor_email\t%ae\tauthor_email_mailmap\t%aE\tauthor_date\t%ad\tauthor_date_RFC2822\t%aD\tauthor_date_relative\t%ar\tauthor_date_unix_timestamp\t%at\tauthor_date_iso_8601\t%ai\tauthor_date_iso_8601_strict\t%aI\tcommitter_name\t%cn\tcommitter_name_mailmap\t%cN\tcommitter_email\t%ce\tcommitter_email_mailmap\t%cE\tcommitter_date\t%cd\tcommitter_date_RFC2822\t%cD\tcommitter_date_relative\t%cr\tcommitter_date_unix_timestamp\t%ct\tcommitter_date_iso_8601\t%ci\tcommitter_date_iso_8601_strict\t%cI\tref_names\t%d\tref_names_no_wrapping\t%D\tencoding\t%e\tsubject\t%s\tsubject_sanitized\t%f\tcommit_notes\t%N\tstats\t' |
          sed '/^[ \t]*$/d' |               # remove all newlines/line-breaks, including those with empty spaces
          tr '\n' 'ò' |                     # convert newlines/line-breaks to a character, so we can manipulate it without much trouble
          tr '\r' ' ' |                     # replace carriage returns with a space, so we avoid new lines popping from placeholders that allow user input
          sed 's/tòcommits/tòòcommits/g' |  # because some commits have no stats, we have to create an extra line-break to make `paste -d ' ' - -` consistent
          tr 'ò' '\n' |                     # bring back all line-breaks
          sed '{
              N
              s/[)]\n\ncommits/)\
          commits/g
          }' |                              # some rogue mystical line-breaks need to go down to their knees and beg for mercy, which they're not getting
          paste -d ' ' - - |                # collapse lines so that the `shortstat` is merged with the rest of the commit data, on a single line
          awk '{print NR"\\t",$0}' |        # print line number in front of each line, along with the `\t` delimiter
          sed 's/\\t\ commits\\trepo/\\t\commits\\trepo/g' # get rid of the one space that shouldn't be there
      
