var utils = require('../generators/utils').json;

describe('Generator JSON utility', function() {
    it('can create and remove JSON files', function() {
        utils.write('test');
        utils.remove('test');
    });
});
