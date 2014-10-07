var message = "Hello from package";

Hello = function(msg) {
  this.setMessage(msg || message);
}

Hello.prototype = {
  print: function() {
    console.log(this.message);
  },

  setMessage: function(msg) {
    this.message = msg;
  },

  getMessage: function() {
    return this.message;
  }
}
