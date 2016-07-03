#!/usr/bin/env bash
TEST_DIRECTORY=~/appdev/techtonic-test-directory
rebirth() {
    cd ~/appdev
    rm -frd $TEST_DIRECTORY
    mkdir $TEST_DIRECTORY
    cd $TEST_DIRECTORY
}
prepare() {
    BUILD_DIR=$1
    mkdir $TEST_DIRECTORY/$BUILD_DIR
    cd $TEST_DIRECTORY/$BUILD_DIR
}
build() {
    read CONTINUE
    if echo "$CONTINUE" | grep -iq "^y" ;then
        npm run build
    fi
}

if [ -d "$TEST_DIRECTORY" ]; then
    rebirth
else
    mkdir -p $TEST_DIRECTORY
    cd $TEST_DIRECTORY
fi

#RLH-BCJAI
prepare RLH-BCJAI
yo techtonic --defaults
echo "RequireJS, Less, Handlebars? Build code? (y/n)"
build

#BSU-BCJAI
prepare BSU-BCJAI
yo techtonic --defaults --script-bundler browserify --css-preprocessor sass --template-technology underscore
echo "Browserify, Sass, and Underscore? Build code? (y/n)"
build

#RLH-_____
prepare RLH-_____
yo techtonic --defaults --skip-benchmark --skip-coveralls --skip-jsinspect --skip-aria --skip-imagemin
echo "NO benchmark, coveralls, JSInspect, ARIA, imagemin? Build code? (y/n)"
build
