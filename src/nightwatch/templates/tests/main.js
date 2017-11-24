'use strict';

const ENOUGH_TIME = 5000;

module.exports = {
    disabled: false,
    tags: ['sanity', 'navigation'],
    'Sanity Check': browser => {
        browser
            .url(browser.launch_url)
            .waitForElementVisible('body', ENOUGH_TIME)
            .assert.title('Omaha Web App');
    },
    'Sanity Check (Page Model)': client => {
        var page = client.page.dev();
        page.navigate()
            .waitForElementVisible('@main', ENOUGH_TIME)
            .log('This is a custom command!')
            .assert.title('Omaha Web App');
        client.end();
    },
    End: browser => browser.end()
};
