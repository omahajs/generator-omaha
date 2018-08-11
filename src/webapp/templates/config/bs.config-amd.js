const files = ['<%= sourceDirectory %>app'];
const port = <%= ports.server %>;

module.exports = {
    files,
    port,
    browser: 'default',
    logLevel: 'info',// debug, silent
    open: 'http://localhost',
    reloadDelay: 500,
    single: false,
    server: {
        baseDir: ['<%= sourceDirectory %>app'],
        routes: {
            '/node_modules': './node_modules',
            '/assets': '<%= sourceDirectory %>assets'
        },
        index: 'index.html'
    },
    watch: true,
    watchOptions: {
        ignoreInitial: true
    }
};
