#!/usr/bin/env bash
. "$(dirname "$0")"/lib/functions.sh
TEST_DIRECTORY=~/appdev/techtonic-test-directory
init_test_directory $TEST_DIRECTORY

RLH_BCJAI="yo techtonic --defaults"
RSH_BCJAI="yo techtonic --defaults --css-preprocessor sass"
RSU_BCJAI="yo techtonic --defaults --css-preprocessor sass --template-technology underscore"
RNH_BCJAI="yo techtonic --defaults --css-preprocessor none"
RNU_BCJAI="yo techtonic --defaults --css-preprocessor none --template-technology underscore"
RLU_BCJAI="yo techtonic --defaults --template-technology underscore"
BLH_BCJAI="yo techtonic --defaults --script-bundler browserify"
BLU_BCJAI="yo techtonic --defaults --script-bundler browserify --template-technology underscore"
BSU_BCJAI="yo techtonic --defaults --script-bundler browserify --css-preprocessor sass --template-technology underscore"
BSH_BCJAI="yo techtonic --defaults --script-bundler browserify --css-preprocessor sass --template-technology handlebars"
BNU_BCJAI="yo techtonic --defaults --script-bundler browserify --css-preprocessor none --template-technology underscore"
BNH_BCJAI="yo techtonic --defaults --script-bundler browserify --css-preprocessor none --template-technology handlebars"

BUILDS="
RLH_BCJAI
RSH_BCJAI
RSU_BCJAI
RNH_BCJAI
RNU_BCJAI
RLU_BCJAI
BLH_BCJAI
BLU_BCJAI
BSU_BCJAI
BSH_BCJAI
BNU_BCJAI
BNH_BCJAI
"
for i in $BUILDS
do
    run $i
done
