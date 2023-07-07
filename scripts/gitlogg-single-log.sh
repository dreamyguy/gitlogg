#!/bin/bash

# https://github.com/dreamyguy/gitinsight
# https://stackoverflow.com/questions/7069682/how-to-get-arguments-with-flags-in-bash
while getopts d:q:s:u:y: flag; do
  case "${flag}" in
    d) yourpath=${OPTARG} ;;
    s) since=${OPTARG} ;;
    u) until=${OPTARG} ;;
    q) quarter=${OPTARG} ;;
    y) year=${OPTARG} ;;
  esac
done

my_dir="$(dirname "$0")"
cd $my_dir

source "colors.sh"

cd ..

# define the absolute path to the directory that contains all your repositories.
# yourpath='./_repos/'

for (( i=0; i<OPTIND-1; i++)); do
    shift
done

yourpath="$@"
# yourpath=$1

# define temporary 'git log' output file that will be parsed to 'json'
tempOutputFile='_tmp/gitlogg.tmp'

# ensure file exists
mkdir -p ${tempOutputFile%%.*}
touch $tempOutputFile

# name and path to this very script, for output message purposes
thisFile='./scripts/gitlogg-generate-log.sh'

# define path to 'json' parser
jsonParser='./scripts/gitlogg-parse-json.js'

# initial message
initialMessage="⚡  ${Pur}~ GITLOGG ~${Yel} ⚡\n\n"

# ensure there's always a '/' at the end of the 'yourpath' variable, since its value can be changed by user.
# case "$yourpath" in
#   */)
#     yourpathSanitized="${yourpath}"   # no changes if there's already a slash at the end - syntax sugar
#     ;;
#   *)
#     yourpathSanitized="${yourpath}/"  # add a slash at the end if there isn't already one
#     ;;
# esac

# 'thepath' sets the path to each repository under 'yourpath' (the trailing asterix [*/] represents all the repository folders).
# thepath="${yourpathSanitized}*/"


# function to trim whitespace
trim() {
    local var="$*"
    var="${var#'${var%%[![:space:]]*}'}"   # remove leading whitespace characters
    var="${var%'${var##*[![:space:]]}'}"   # remove trailing whitespace characters
    echo -n "$var"
}

# number of directories (repos) under 'thepath'
# DIRCOUNT="$(find $thepath -maxdepth 0 -type d | wc -l)"

# trim whitespace from DIRCOUNT
# DIRNR="$(trim $DIRCOUNT)"

reporef="the one repository"

# determine if we're dealing with a singular repo or multiple
# if [ "${DIRNR}" -gt "1" ]; then
#   reporef="all ${Red}${DIRNR}${Yel} repositories"
# elif [ "${DIRNR}" -eq "1" ]; then
#   reporef="the one repository"
# fi

# start counting seconds elapsed
SECONDS=0
yourpathSanitized="${yourpath}"
thepath="${yourpathSanitized}*/"

echo "thepath: ${yourpathSanitized}"

if [ -z "${since}" ]; then
  since='Apr 1 2023'
fi

if [ -z "${until}" ]; then
  until='Jun 30 2023'
fi

if [ -z "${year}" ]; then
  year=`date +%Y`
fi

if [[ $quarter == 1 ]]; then
  since="Jan 1 ${year}"
  until="Mar 31 ${year}"
elif [[ $quarter == 2 ]]; then
  since="Apr 1 ${year}"
  until="Jun 30 ${year}"
elif [[ $quarter == 3 ]]; then
  since="Jul 1 ${year}"
  until="Sep 30 ${year}"
elif [[ $quarter == 4 ]]; then
  since="Oct 1 ${year}"
  until="Dec 31 ${year}"
fi

# if the path exists and is not empty
if [ -d "${yourpathSanitized}" ] && [ "$(ls $yourpathSanitized)" ]; then
  echo -e "${initialMessage} Generating ${Pur}git log ${Yel}for ${reporef} located at ${Red}'${thepath}'${Yel}. ${Blu}This might take a while!${RCol}\n"
  dir=$thepath
  (cd $dir &&
        echo -e " ${Whi}Outputting ${Pur}${PWD##*/}${RCol}" >&2 &&
        git log --since="${since}" --until="${until}" --all --no-merges --shortstat --reverse --pretty=format:'commits\trepository\t'"${PWD##*/}"'\tcommit_hash\t%H\tcommit_hash_abbreviated\t%h\ttree_hash\t%T\ttree_hash_abbreviated\t%t\tparent_hashes\t%P\tparent_hashes_abbreviated\t%p\tauthor_name\t%an\tauthor_name_mailmap\t%aN\tauthor_email\t%ae\tauthor_email_mailmap\t%aE\tauthor_date\t%ad\tauthor_date_RFC2822\t%aD\tauthor_date_relative\t%ar\tauthor_date_unix_timestamp\t%at\tauthor_date_iso_8601\t%ai\tauthor_date_iso_8601_strict\t%aI\tcommitter_name\t%cn\tcommitter_name_mailmap\t%cN\tcommitter_email\t%ce\tcommitter_email_mailmap\t%cE\tcommitter_date\t%cd\tcommitter_date_RFC2822\t%cD\tcommitter_date_relative\t%cr\tcommitter_date_unix_timestamp\t%ct\tcommitter_date_iso_8601\t%ci\tcommitter_date_iso_8601_strict\t%cI\tref_names\t%d\tref_names_no_wrapping\t%D\tencoding\t%e\tsubject\t%s\tsubject_sanitized\t%f\tcommit_notes\t%N\tstats\t' |
          iconv -f ISO-8859-1 -t UTF-8 |       # convert ISO-8859-1 encoding to UTF-8
          sed '/^[ \t]*$/d' |                  # remove all newlines/line-breaks, including those with empty spaces
          tr '\n' 'ȝ' |                        # convert newlines/line-breaks to a character, so we can manipulate it without much trouble
          tr '\r' ' ' |                        # replace carriage returns with a space, so we avoid new lines popping from placeholders that allow user input
          sed 's/tȝcommits/tȝȝcommits/g' |     # because some commits have no stats, we have to create an extra line-break to make `paste -d ' ' - -` consistent
          tr 'ȝ' '\n' |                        # bring back all line-breaks
          sed '{
              N
              s/[)]\n\ncommits/)\
          commits/g
          }' |                                 # some rogue mystical line-breaks need to go down to their knees and beg for mercy, which they're not getting
          paste -d ' ' - - |                   # collapse lines so that the `shortstat` is merged with the rest of the commit data, on a single line
          awk '{print NR"\\t",$0}' |           # print line number in front of each line, along with the `\t` delimiter
          sed 's/\\t\ commits\\trepo/\\t\commits\\trepo/g' # get rid of the one space that shouldn't be there
      ) > "${tempOutputFile}"
  echo -e "\n ${Gre}The file ${Blu}${tempOutputFile} ${Gre}generated in${RCol}: ${SECONDS}s" &&
  babel "${jsonParser}" | node                 # only parse JSON if we have a source to parse it from
# if the path exists but is empty
elif [ -d "${yourpathSanitized}" ] && [ ! "$(ls $yourpathSanitized)" ]; then
  echo -e "\n ${Whi}[ERROR 002]: ${Yel}The path to the local repositories ${Red}'${yourpath}'${Yel}, which is set on the file ${Blu}'${thisFile}' ${UYel}exists, but is empty!${RCol}"
  echo -e " ${Yel}Please move the repos to ${Red}'${yourpath}'${Yel} or update the variable ${Pur}'yourpath'${Yel} to reflect the absolute path to the directory where the repos are located.${RCol}"
# if the path does not exists
elif [ ! -d "${yourpathSanitized}" ]; then
  echo -e "\n ${Whi}[ERROR 001]: ${Yel}The path to the local repositories ${Red}'${yourpath}'${Yel}, which is set on the file ${Blu}'${thisFile}' ${UYel}does not exist!${RCol}"
  echo -e " ${Yel}Please create ${Red}'${yourpath}'${Yel} and move the repos under it, or update the variable ${Pur}'yourpath'${Yel} to reflect the absolute path to the directory where the repos are located.${RCol}"
fi
