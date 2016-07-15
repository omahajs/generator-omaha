define(function(require) {
    'use strict';

    require('sinon');

    describe('When using this web app template', function() {
        it('should be awesome.', function() {
            expect(true).toBeTruthy();
        });
        it('should be able to parse JSON objects', function() {
            var data = JSON.parse('{"foo": "bar"}');
            expect(data.foo).toMatch('bar');
        });
        it('should be able to use SinonJS for servers', function() {
            var server = sinon.fakeServer.create();
            server.restore();
        });
        it('should be able to use SinonJS spies', function() {
            var object = {method: function () {}};
            var spy = sinon.spy(object, 'method');
            spy.withArgs(42);
            spy.withArgs(1);
            object.method(42);
            object.method(1);
            sinon.assert.calledOnce(spy.withArgs(42));
            sinon.assert.calledOnce(spy.withArgs(1));
        });
        it('should be able to use SinonJS stubs', function() {
            var callback = sinon.stub();
            callback.onFirstCall().returns(1);
            callback.onSecondCall().returns(2);
            callback.onCall(3).returns(3);
            callback.returns(3);
            callback.withArgs(42).returns(4);
            expect(callback()).toEqual(1);
            expect(callback()).toEqual(2);
            expect(callback()).toEqual(3);
            expect(callback()).toEqual(3);
            expect(callback(42)).toEqual(4);
        });
    });
});
