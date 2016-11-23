#!/bin/bash

my_dir="$(dirname "$0")"
cd $my_dir

bash gitlogg-generate-log.sh $@
