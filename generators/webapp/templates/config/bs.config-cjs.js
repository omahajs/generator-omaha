const browser = 'default';
const files = ['./dist/client'];
const port = <%= ports.server %>;

module.exports = {
    files,
    port,
    browser: 'default',
    logLevel: 'info',// debug, silent
    open: 'http://localhost',
    reloadDelay: 500,
    single: false,
    server: [
        'dist',
        './dist/client'
    ],
    watch: true,
    watchOptions: {
        ignoreInitial: true
    }
};
