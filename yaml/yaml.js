YAML = Npm.require('js-yaml');

var compile = function(compileStep) {
  var data = compileStep.read().toString('utf8');
  var object = YAML.safeLoad(data);
  var jscode = "YAML['" + compileStep.inputPath + "'] = " + JSON.stringify(object) + ";"

  compileStep.addJavaScript({
    path:       compileStep.inputPath + '.js',
    sourcePath: compileStep.inputPath,
    data:       jscode
  });
}

Plugin.registerSourceHandler("yml",  compile);
Plugin.registerSourceHandler("yaml", compile);
