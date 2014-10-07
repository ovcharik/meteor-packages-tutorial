Package.describe({
  version: "1.0.0"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');

  api.addFiles('export.js');

  api.export('YAML');
});

Package._transitional_registerBuildPlugin({
  name: 'yaml',
  use: [
    'underscore'
  ],
  sources: [
    'yaml.js'
  ],
  npmDependencies: {
    'js-yaml': '3.2.2',
  }
});
