(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  (function($, controls, window, document) {
    var RangeControl;
    RangeControl = (function(_super) {
      __extends(RangeControl, _super);

      RangeControl.selector = 'range';

      function RangeControl() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        RangeControl.__super__.constructor.apply(this, args);
      }

      return RangeControl;

    })(controls.InputControl);
    return $.echoforms.control(RangeControl, {
      "export": true
    });
  })(jQuery, jQuery.echoforms.controls, window, document);

}).call(this);
