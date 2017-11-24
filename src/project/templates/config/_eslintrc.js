module.exports = {
    env: {
        node: true,
        es6: true,
        mocha: <%= !useJest %>,
        jest: <%= useJest %>
    },
    globals: {
        sinon: true
    },
    extends: 'omaha-prime-grade'
};
