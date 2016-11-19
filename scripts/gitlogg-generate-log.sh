source "$__dirname/colors.sh"

runJs() {
  local script="$1"
  shift
  if [[ "$GITLOGG_DEV" = "" ]]; then
    # Run precompiled .compiled.js
    node "${script%.js}.compiled.js" "$@"
  else
    # Development: transpile .js at runtime
    babel "$script" | node "$@"
  fi
}

workerFile="$__dirname/output-intermediate-gitlog.sh"

# define path to 'json' parser
jsonParser="$__dirname/gitlogg-parse-json.js"

# Display system usage and exit
usage()
{
  local exitCode="$1"
  cat <<\USAGE_EOF
usage: gitlogg [options] [repository ...]
The following options are available
 -n X: Run X instances of gitlogg concurrently
USAGE_EOF
  exit $exitCode
}

test "$1" = "--help" && usage

# Use n-1 processors per default, so the system is not overloaded
NUM_THREADS=$(($(getconf _NPROCESSORS_ONLN)-1))
test $NUM_THREADS -lt 1 && NUM_THREADS=1

test "$1" = "-n" && NUM_THREADS=$2
echo -e "${Blu}Info: Calculating in $NUM_THREADS thread(s)${RCol}"

# Each positional argument is a path to a git repository
repositories=("$@")

# number of directories (repos)
DIRCOUNT="${#repositories[@]}"

# determine if we're dealing with a singular repo or multiple
if [ "${DIRCOUNT}" -gt "1" ]; then
  reporef="${Red}${DIRCOUNT}${Yel} repositories"
elif [ "${DIRCOUNT}" -eq "1" ]; then
  reporef="${Red}${DIRCOUNT}${Yel} repository"
elif [ "${DIRCOUNT}" -eq "0" ]; then
  echo -e "${Whi}[ERROR 003]: ${Yel}No repositories specified${RCol}" 1>&2
  usage 1 1>&2
fi

# start counting seconds elapsed
SECONDS=0

echo -e "${Yel}Generating ${Pur}git log ${Yel}for ${reporef} located at ${Red}'${thepath}'${Yel}. ${Blu}This might take a while!${RCol}"
echo "${repositories[@]}" \
| xargs -n 1 -P $NUM_THREADS "$workerFile" \
| runJs "${jsonParser}" 3<&0 4>"gitlogg.json"             # only parse JSON if we have a source to parse it from