module.exports = {
    env: {
        amd: <%= (moduleFormat === 'amd') %>,
        commonjs: <%= (moduleFormat === 'commonjs') %>,
        es6: true,
        browser: true,
        jquery: true,
        mocha: <%= !useJest %>,
        jest: <%= !!useJest %>
    },
    globals: {
        sinon: true
    },
    extends: 'omaha-prime-grade',
    plugins: [
        'backbone'
    ],
    rules: {
        'backbone/collection-model': ['warn'],
        'backbone/defaults-on-top': ['warn'],
        'backbone/model-defaults': ['warn'],
        'backbone/no-collection-models': ['warn'],
        'backbone/no-model-attributes': ['warn']
    }
};
