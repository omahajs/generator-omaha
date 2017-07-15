module.exports = {
    src_folders: ['./test/nightwatch/tests'],
    output_folder: './test/nightwatch/reports',
    custom_commands_path: './test/nightwatch/commands',
    custom_assertions_path: './test/nightwatch/assertions',
    page_objects_path: './test/nightwatch/pages',
    globals_path: './test/nightwatch/globals.js',
    selenium: {
        start_process: true,
        server_path: './bin/selenium-server-standalone.jar',
        log_path: '',
        host: '127.0.0.1',
        port: 4444,
        cli_args: {
            'webdriver.chrome.driver': './bin/chromedriver',
            'webdriver.ie.driver': ''
        }
    },
    test_workers: {
        enabled: true,
        workers: 'auto'
    },
    test_settings: {
        default: {
            launch_url: 'http://localhost:1337/app',
            selenium_port: 4444,
            selenium_host: 'localhost',
            silent: true,
            screenshots: {
                enabled: true,
                on_failure: true,
                on_error: true,
                path: './test/nightwatch/screenshots'
            },
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                webStorageEnabled: true,
                acceptSslCerts: true
            }
        }
    }
};
