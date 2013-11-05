(function() {
  window.pending = function(desc, func) {
    return jasmine.getEnv().pending(desc, func);
  };

  jasmine.Env.prototype.pending = function(description, func) {
    var spec;
    spec = new jasmine.Spec(this, this.currentSuite, description);
    this.currentSuite.add(spec);
    this.currentSpec = spec;
    spec.runs(function() {
      return console.warn("Pending: " + (this.getFullName()));
    });
    return spec;
  };

}).call(this);
