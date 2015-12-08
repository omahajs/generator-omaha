'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('techtonic:app', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({skipInstall: true})
      .withPrompts({
          autoFix: true,
          useJsinspect: true,
          useBuddyjs: true,
          useA11y: true,
          compressImages: true,
          useCoveralls: false
      })
      .on('end', done);
  });

  it('creates files', function() {
    assert.file([
      'package.json',
      'Gruntfile.js',
      'README.md',
      'LICENSE',
      'tasks/main.js',
      'tasks/build.js',
      'tasks/test.js',
      'app/index.html',
      'app/app.js',
      'app/main.js',
      'app/config.js',
      'app/router.js'
    ]);
  });
});
