module.exports = {
    env: {
        amd: true,
        browser: true,
        jquery: true,
        mocha: true
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
