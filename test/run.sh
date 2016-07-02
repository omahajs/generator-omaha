#!/usr/bin/env bash
TEST_DIRECTORY=~/appdev/techtonic-test-directory
rebirth() {
    cd ~/appdev
    rm -frd $TEST_DIRECTORY
    mkdir $TEST_DIRECTORY
    cd $TEST_DIRECTORY
}
next_step() {
    PASSED=$1
    if echo "$PASSED" | grep -iq "^y" ;then
        npm run demo
    fi
    rebirth
    echo "On to the next test..."
}

mkdir -p $TEST_DIRECTORY
cd $TEST_DIRECTORY

yo techtonic --defaults --skip-benchmark --skip-coveralls --skip-jsinspect --skip-aria --skip-imagemin
echo "No benchmark, coveralls, JSInspect, ARIA, imagemin? Run demo? (y/n)"
read passed
next_step $passed

yo techtonic --defaults --script-bundler browserify --css-preprocessor sass --template-technology underscore
echo "Browserify, Sass, and Underscore? Run demo? (y/n)"
read passed
next_step $passed
