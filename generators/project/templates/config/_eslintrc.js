module.exports = {
    env: {
        amd: true,
        browser: true,
        jquery: true
    },
    plugins: [
        'backbone'
    ],
    rules: {
        'backbone/collection-model': ['warn'],
        'backbone/defaults-on-top': ['warn'],
        'backbone/model-defaults': ['warn'],
        'backbone/no-collection-models': ['warn'],
        'backbone/no-model-attributes': ['warn']
    },
    extends: 'omaha-prime-grade'
}
