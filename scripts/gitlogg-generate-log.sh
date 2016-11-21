#!/bin/bash

my_dir="$(dirname "$0")"
cd $my_dir

source "colors.sh"

cd ..
pwd

# define the absolute path to the directory that contains all your repositories.
yourpath='./_repos/'

# define temporary 'git log' output file that will be parsed to 'json'
tempOutputFile='_tmp/gitlogg.tmp'

# name and path to this very script, for output message purposes
thisFile='./scripts/gitlogg-generate-log.sh'

# define path to 'json' parser
jsonParser='./scripts/gitlogg-parse-json.js'


# Display system usage and exit
usage()
{
  cat <<\USAGE_EOF
usage: gitlogg-generate-log.sh [options]
The following options are available
 -n X: Run X instances of gitlogg concurrently
USAGE_EOF
  exit 2
}

test "$1" = "--help" && usage

# Use n-1 processors per default, so the system is not overloaded
NUM_THREADS=$(($(getconf _NPROCESSORS_ONLN)-1))
test $NUM_THREADS -lt 1 && NUM_THREADS=1

test "$1" = "-n" && NUM_THREADS=$2
echo -e "${Blu}Info: Calculating in $NUM_THREADS thread(s)${RCol}"

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
  dirs=$(ls -d $thepath)
  echo $dirs | xargs -n 1 -P $NUM_THREADS ./output-intermediate-gitlog.sh > ${tempOutputFile}
  echo -e "${Gre}The file ${Blu}${tempOutputFile} ${Gre}generated in${RCol}: ${SECONDS}s" &&
  babel "${jsonParser}" | node              # only parse JSON if we have a source to parse it from
# if the path exists but is empty
elif [ -d "${yourpathSanitized}" ] && [ ! "$(ls $yourpathSanitized)" ]; then
  echo -e "${Whi}[ERROR 002]: ${Yel}The path to the local repositories ${Red}'${yourpath}'${Yel}, which is set on the file ${Blu}'${thisFile}' ${UYel}exists, but is empty!${RCol}"
  echo -e "${Yel}Please move the repos to ${Red}'${yourpath}'${Yel} or update the variable ${Pur}'yourpath'${Yel} to reflect the absolute path to the directory where the repos are located.${RCol}"
# if the path does not exists
elif [ ! -d "${yourpathSanitized}" ]; then
  echo -e "${Whi}[ERROR 001]: ${Yel}The path to the local repositories ${Red}'${yourpath}'${Yel}, which is set on the file ${Blu}'${thisFile}' ${UYel}does not exist!${RCol}"
  echo -e "${Yel}Please create ${Red}'${yourpath}'${Yel} and move the repos under it, or update the variable ${Pur}'yourpath'${Yel} to reflect the absolute path to the directory where the repos are located.${RCol}"
fi
