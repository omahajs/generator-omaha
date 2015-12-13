'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var mkdirp = require('mkdirp');

describe('techtonic:web', function() {
    describe('when installed into an empty project', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/web'))
                .withOptions({skipInstall: true})
                .withPrompts({
                    //serverDirectory: existingDirectory
                })
                .on('end', done);
        });
        it('creates files', function() {
            assert.file([
                'package.json',
                'app.json',
                'index.js',
                'config/default.js',
                'web/socket.js',
                'web/server.js'
            ]);
        });
        it('configures files', function() {
            assert.fileContent('config/default.js', 'port: 13337');
            assert.fileContent('config/default.js', 'port: process.env.PORT || 3000');
        });
    });
});
