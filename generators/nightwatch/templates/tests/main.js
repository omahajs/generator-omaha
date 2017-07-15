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
    'End': (browser) => {
        browser.end();
    }
};
