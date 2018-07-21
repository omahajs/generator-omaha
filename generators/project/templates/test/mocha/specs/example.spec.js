<% if (moduleFormat === 'amd') { %>define(function(require) {
    'use strict';
<% } %>
    const sinon    = require('sinon');
    const {expect} = require('chai');
    const webapp   = require('app');

    describe('My Super Cool Web App', () => {
        it('should have a predictable state container', () => {
            let initialCount = 42;
            expect(webapp.getState().name).to.equal('omaha-project');
            expect(webapp.getState('count')).to.equal(initialCount);// 42
            webapp.dispatch({type: 'INCREMENT'});
            expect(webapp.getState('count')).to.equal(initialCount + 1);// 43
            webapp.dispatch({type: 'DECREMENT'});
            expect(webapp.getState('count')).to.equal(initialCount);// 42
        });
        it('should be able to use SinonJS for servers', () => {
            let server = sinon.fakeServer.create();
            server.restore();
        });
        it('should be able to use SinonJS spies', () => {
            let object = {method: () => {}};
            let spy = sinon.spy(object, 'method');
            spy.withArgs(2);
            spy.withArgs(1);
            object.method(2);
            object.method(1);
            sinon.assert.calledOnce(spy.withArgs(2));
            sinon.assert.calledOnce(spy.withArgs(1));
        });
        it('should be able to use SinonJS stubs', () => {
            let callback = sinon.stub();
            callback.onFirstCall().returns(1);
            callback.onSecondCall().returns(2);
            callback.onCall(3).returns(3);
            callback.returns(3);
            callback.withArgs(2).returns(1);
            expect(callback()).to.equal(1);
            expect(callback()).to.equal(2);
            expect(callback()).to.equal(3);
            expect(callback()).to.equal(3);
            expect(callback(2)).to.equal(1);
        });
    });<% if (moduleFormat === 'amd') { %>
});<% } %>
