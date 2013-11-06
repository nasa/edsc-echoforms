(function() {
  window.sharedBehaviorForGroupingControls = function(template) {
    return it("scopes child control xpaths", function() {
      template.form(dom);
      $('#childReference :input').val('value1').change();
      expect($('#child :input').val()).toBe('value1');
      $('#child :input').val('value2').change();
      return expect($('#childReference :input').val()).toBe('value2');
    });
  };

}).call(this);
