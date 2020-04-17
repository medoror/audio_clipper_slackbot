#!/usr/bin/env bash

set -ex
fly -t bucc sp -p audio-clipper -c clipper-pipeline-ci.yml
