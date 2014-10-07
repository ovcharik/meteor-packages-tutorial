Package.describe({
  version: "1.0.0"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');

  api.addFiles('hello.js');

  api.export('Hello');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('underscore');
  api.use('hello');
  api.addFiles('hello-tests.js');
});
