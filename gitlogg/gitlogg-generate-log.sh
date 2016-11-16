#!/usr/bin/env bash

# Text Reset
RCol='\033[0m'

# Regular             Bold                  Underline             High Intensity        BoldHigh Intens       Background            High Intensity Backgrounds
Bla='\033[0;30m';     BBla='\033[1;30m';    UBla='\033[4;30m';    IBla='\033[0;90m';    BIBla='\033[1;90m';   On_Bla='\033[40m';    On_IBla='\033[0;100m';
Red='\033[0;31m';     BRed='\033[1;31m';    URed='\033[4;31m';    IRed='\033[0;91m';    BIRed='\033[1;91m';   On_Red='\033[41m';    On_IRed='\033[0;101m';
Gre='\033[0;32m';     BGre='\033[1;32m';    UGre='\033[4;32m';    IGre='\033[0;92m';    BIGre='\033[1;92m';   On_Gre='\033[42m';    On_IGre='\033[0;102m';
Yel='\033[0;33m';     BYel='\033[1;33m';    UYel='\033[4;33m';    IYel='\033[0;93m';    BIYel='\033[1;93m';   On_Yel='\033[43m';    On_IYel='\033[0;103m';
Blu='\033[0;34m';     BBlu='\033[1;34m';    UBlu='\033[4;34m';    IBlu='\033[0;94m';    BIBlu='\033[1;94m';   On_Blu='\033[44m';    On_IBlu='\033[0;104m';
Pur='\033[0;35m';     BPur='\033[1;35m';    UPur='\033[4;35m';    IPur='\033[0;95m';    BIPur='\033[1;95m';   On_Pur='\033[45m';    On_IPur='\033[0;105m';
Cya='\033[0;36m';     BCya='\033[1;36m';    UCya='\033[4;36m';    ICya='\033[0;96m';    BICya='\033[1;96m';   On_Cya='\033[46m';    On_ICya='\033[0;106m';
Whi='\033[0;37m';     BWhi='\033[1;37m';    UWhi='\033[4;37m';    IWhi='\033[0;97m';    BIWhi='\033[1;97m';   On_Whi='\033[47m';    On_IWhi='\033[0;107m';

# define the absolute path to the directory that contains all your repositories.
yourpath=../repos/

# ensure there's always a '/' at the end of the 'yourpath' variable, since its value can be changed by user.
case "$yourpath" in
  */)
    yourpathSanitized="${yourpath}"   # no changes if there's already a slash at the end - syntax sugar
    ;;
  *)
    yourpathSanitized="${yourpath}/"  # add a slash at the end if there isn't already one
    ;;
esac

# 'thepath' sets the path to each repository under 'yourpath' (the trailing asterix [*/] represents all the repository folders).
thepath="${yourpathSanitized}*/"

# function to trim whitespace
trim() {
    local var="$*"
    var="${var#'${var%%[![:space:]]*}'}"   # remove leading whitespace characters
    var="${var%'${var##*[![:space:]]}'}"   # remove trailing whitespace characters
    echo -n "$var"
}

# number of directories (repos) under 'thepath'
DIRCOUNT="$(find $thepath -maxdepth 0 -type d | wc -l)"

# trim whitespace from DIRCOUNT
DIRNR="$(trim $DIRCOUNT)"

# determine if we're dealing with a singular repo or multiple
if [ "${DIRNR}" -gt "1" ]; then
  reporef="all ${Red}${DIRNR}${Yel} repositories"
elif [ "${DIRNR}" -eq "1" ]; then
  reporef="the one repository"
fi

# start counting seconds elapsed
SECONDS=0

# if the path exists and is not empty
if [ -d "${yourpathSanitized}" ] && [ "$(ls $yourpathSanitized)" ]; then
  echo -e "${Yel}Generating ${Pur}git log ${Yel}for ${reporef} located at ${Red}'${thepath}'${Yel}. ${Blu}This might take a while!${RCol}"
  for dir in $thepath
  do
      (cd $dir &&
        echo -e "${Whi}Outputting ${Pur}${PWD##*/}${RCol}" >&2 &&
        git log --all --no-merges --shortstat --reverse --pretty=format:'commits\trepository\t'"${PWD##*/}"'\tcommit_hash\t%H\tcommit_hash_abbreviated\t%h\ttree_hash\t%T\ttree_hash_abbreviated\t%t\tparent_hashes\t%P\tparent_hashes_abbreviated\t%p\tauthor_name\t%an\tauthor_name_mailmap\t%aN\tauthor_email\t%ae\tauthor_email_mailmap\t%aE\tauthor_date\t%ad\tauthor_date_RFC2822\t%aD\tauthor_date_relative\t%ar\tauthor_date_unix_timestamp\t%at\tauthor_date_iso_8601\t%ai\tauthor_date_iso_8601_strict\t%aI\tcommitter_name\t%cn\tcommitter_name_mailmap\t%cN\tcommitter_email\t%ce\tcommitter_email_mailmap\t%cE\tcommitter_date\t%cd\tcommitter_date_RFC2822\t%cD\tcommitter_date_relative\t%cr\tcommitter_date_unix_timestamp\t%ct\tcommitter_date_iso_8601\t%ci\tcommitter_date_iso_8601_strict\t%cI\tref_names\t%d\tref_names_no_wrapping\t%D\tencoding\t%e\tsubject\t%s\tsubject_sanitized\t%f\tcommit_notes\t%N\tstats\t' |
          sed '/^[ \t]*$/d' |               # remove all newlines/line-breaks, including those with empty spaces
          tr '\n' 'ò' |                     # convert newlines/line-breaks to a character, so we can manipulate it without much trouble
          tr '\r' 'ò' |                     # convert carriage returns to a character, so we can manipulate it without much trouble
          sed 's/tòcommits/tòòcommits/g' |  # because some commits have no stats, we have to create an extra line-break to make `paste -d ' ' - -` consistent
          tr 'ò' '\n' |                     # bring back all line-breaks
          sed '{
              N
              s/[)]\n\ncommits/)\
          commits/g
          }' |                              # some rogue mystical line-breaks need to go down to their knees and beg for mercy, which they're not getting
          paste -d ' ' - -                  # collapse lines so that the `shortstat` is merged with the rest of the commit data, on a single line
      )
  done > gitlogg.tmp
  echo -e "${Gre}The file ${Blu}./gitlogg.tmp ${Gre}generated in${RCol}: ${SECONDS}s" &&
  babel gitlogg-parse-json.js | node        # only parse JSON if we have a source to parse it from
# if the path exists but is empty
elif [ -d "${yourpathSanitized}" ] && [ ! "$(ls $yourpathSanitized)" ]; then
  echo -e "${Whi}[ERROR 002]: ${Yel}The path to the local repositories ${Red}'${yourpath}'${Yel}, which is set on the file ${Blu}'gitlogg-generate-log.sh' ${UYel}exists, but is empty!${RCol}"
  echo -e "${Yel}Please move the repos to ${Red}'${yourpath}'${Yel} or update the variable ${Pur}'yourpath'${Yel} to reflect the absolute path to the directory where the repos are located.${RCol}"
# if the path does not exists
elif [ ! -d "${yourpathSanitized}" ]; then
  echo -e "${Whi}[ERROR 001]: ${Yel}The path to the local repositories ${Red}'${yourpath}'${Yel}, which is set on the file ${Blu}'gitlogg-generate-log.sh' ${UYel}does not exist!${RCol}"
  echo -e "${Yel}Please create ${Red}'${yourpath}'${Yel} and move the repos under it, or update the variable ${Pur}'yourpath'${Yel} to reflect the absolute path to the directory where the repos are located.${RCol}"
fi
