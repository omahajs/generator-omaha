#!/usr/bin/env bash
TEST_DIRECTORY=~/appdev/techtonic-test-directory
log() {
    TIMEZONE=Central
    MAXLEN=35
    MSG=$1
    for i in $(seq ${#MSG} $MAXLEN)
    do
        MSG=$MSG.
    done
    MSG=$MSG$(TZ=":US/$TIMEZONE" date +%T)
    echo $MSG
}
init_test_directory() {
    TEST_DIRECTORY=$1
    if [ -d "$TEST_DIRECTORY" ]; then
        cd ~/appdev
        rm -frd $TEST_DIRECTORY
        mkdir $TEST_DIRECTORY
    else
        mkdir -p $TEST_DIRECTORY
        cd $TEST_DIRECTORY
    fi
}
prepare() {
    BUILD_ID=$1
    SILENT=" > ${TEST_DIRECTORY}/${BUILD_ID}/log-setup.txt 2>&1"
    mkdir $TEST_DIRECTORY/$BUILD_ID
    cd $TEST_DIRECTORY/$BUILD_ID
    log "$BUILD_ID: start setup"
    eval "COMMAND=\${"$BUILD_ID"}"
    eval ${COMMAND}${SILENT}
}
build() {
    BUILD_ID=$1
    log "${BUILD_ID}: start build"
    npm run build --silent > $TEST_DIRECTORY/$BUILD_ID/log-build.txt
}
check_build() {
    BUILD_ID=$1
    if cat $TEST_DIRECTORY/$BUILD_ID/log-build.txt | grep -q "Aborted due to warnings." ;then
        log "${BUILD_ID}: FAILURE"
        if type toilet >/dev/null 2>&1; then
            toilet -f pagga FAILURE
        fi
        echo "✗ ${BUILD_ID} build FAILURE" >> $TEST_DIRECTORY/results.txt
    else
        log "${BUILD_ID}: SUCCESS"
        echo "✔ ${BUILD_ID} build SUCCESS" >> $TEST_DIRECTORY/results.txt
    fi
}
run() {
    BUILD_ID=$1
    prepare ${BUILD_ID}
    build ${BUILD_ID}
    check_build ${BUILD_ID}
}

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
