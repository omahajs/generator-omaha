'use strict';

module.exports = {
    disabled: false,
    tags: ['sanity', 'navigation'],
    'Sanity Check': (browser) => {
        browser
            .url(browser.launch_url)
            .waitForElementVisible('body', 5000)
            .assert.title('Omaha Web App');
    },
    'Sanity Check (Page Model)': (client) => {
        var page = client.page.dev();
        page.navigate()
            .waitForElementVisible('@main', 5000)
            .assert.title('Omaha Web App');
        client.end();
    },
    'End': (browser) => {
        browser.end();
    }
};
