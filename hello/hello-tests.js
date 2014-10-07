Tinytest.add('Hello class exists', function (test) {
  test.isTrue(_.isFunction(Hello), "Hello not exists");
});
