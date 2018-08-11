module.exports = {
    browser: 'default',
    files: ['./dist/client'],
    logLevel: 'info',// debug, silent
    open: 'http://localhost',
    port: <%= ports.server %>,
    reloadDelay: 500,
    single: false,
    server: [
        'dist',
        './dist/client'
    ],
    watch: false
};
