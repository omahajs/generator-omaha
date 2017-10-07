/* eslint-env jest */
'use strict';

describe('Some Component', function() {
    let foo;
    beforeAll(() => {
        foo = new Date();
    });
    it('can do stuff', () => {
        expect(typeof foo).toEqual('object');
    });
});
