'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('techtonic:web', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../generators/web'))
      .withOptions({skipInstall: true})
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
});
