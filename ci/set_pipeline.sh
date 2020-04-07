#!/usr/bin/env bash

set -ex
fly -t main sp -p audio-clipper -c clipper-pipeline-ci.yml -l ~/.credentials.yml
