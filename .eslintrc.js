// .eslintrc.js
// -> Curated selection of rules
// -> Maximum auto-fix capability
// -> Secure coding practices baked in
module.exports = {
    extends: 'omaha-prime-grade',
    env: {
        node: true,
        browser: true,
        es6: true,
        mocha: true
    },
    rules: {
        'max-nested-callbacks': ['warn', 4],
        'valid-jsdoc': 'off',
        'no-magic-numbers': ['warn', { 'ignore': [-1, 0, 1, 2, 3, 10, 100]}]
    }
};
