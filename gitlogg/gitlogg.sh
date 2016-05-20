#!/usr/bin/env bash

bash gitlogg-generate-log.sh && babel gitlogg-retrieve-data.js | node
