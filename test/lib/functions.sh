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
PASS() {
    BUILD_ID=$1
    echo "✔ ${BUILD_ID} build SUCCESS" >> $TEST_DIRECTORY/results.txt
}
FAIL() {
    BUILD_ID=$1
    log "${BUILD_ID}: FAILURE"
    if type toilet >/dev/null 2>&1; then
        toilet -f pagga FAILURE
    fi
    echo "✗ ${BUILD_ID} build FAILURE" >> $TEST_DIRECTORY/results.txt
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
    log "$BUILD_ID: start"
    eval "COMMAND=\${"$BUILD_ID"}"
    eval ${COMMAND}${SILENT}
}
build() {
    BUILD_ID=$1
    npm run build --silent > $TEST_DIRECTORY/$BUILD_ID/log-build.txt
    npm test --silent > $TEST_DIRECTORY/$BUILD_ID/log-test.txt
}
check_build() {
    BUILD_ID=$1
    if cat $TEST_DIRECTORY/$BUILD_ID/log-build.txt | grep -q "Aborted due to warnings." ;then
        FAIL $BUILD_ID
    else
        if cat $TEST_DIRECTORY/$BUILD_ID/log-test.txt | grep -q "Done." ;then
            PASS $BUILD_ID
        else
            FAIL $BUILD_ID
        fi
    fi
}
run() {
    BUILD_ID=$1
    prepare ${BUILD_ID}
    build ${BUILD_ID}
    check_build ${BUILD_ID}
}
