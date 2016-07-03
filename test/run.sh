#!/usr/bin/env bash
TEST_DIRECTORY=~/appdev/techtonic-test-directory
rebirth() {
    cd ~/appdev
    rm -frd $TEST_DIRECTORY
    mkdir $TEST_DIRECTORY
    cd $TEST_DIRECTORY
}
next_step() {
    read CONTINUE
    if echo "$CONTINUE" | grep -iq "^y" ;then
        npm run build
    fi
    rebirth
}

if [ -d "$TEST_DIRECTORY" ]; then
    rebirth
else
    mkdir -p $TEST_DIRECTORY
    cd $TEST_DIRECTORY
fi

#RLH-_____
yo techtonic --defaults --skip-benchmark --skip-coveralls --skip-jsinspect --skip-aria --skip-imagemin
echo "NO benchmark, coveralls, JSInspect, ARIA, imagemin? Build code? (y/n)"
next_step

#BSU-BCJAI
yo techtonic --defaults --script-bundler browserify --css-preprocessor sass --template-technology underscore
echo "Browserify, Sass, and Underscore? Build code? (y/n)"
next_step
