#!/usr/bin/env bash

TEST_DIRECTORY=~/.omahajs-builds-output-directory
TEST_LIB_DIRECTORY=$PWD/test/lib
BUILDS_FILE=$TEST_LIB_DIRECTORY/builds
BUILDS=$(cut -d'=' -f1 $BUILDS_FILE)

# Source utility functions such as run
. $TEST_LIB_DIRECTORY/functions.sh

# Prepare directory to store builds
init_test_directory $TEST_DIRECTORY
cd $TEST_DIRECTORY

# Declare variables for build commands
eval $(cat $BUILDS_FILE)

# Run builds
for i in $BUILDS
do
    run $i
done
