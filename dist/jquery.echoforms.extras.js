(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($, controls, window, document) {
    var RangeSliderControl, _ref;
    RangeSliderControl = (function(_super) {
      __extends(RangeSliderControl, _super);

      function RangeSliderControl() {
        _ref = RangeSliderControl.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      RangeSliderControl.selector = 'range';

      RangeSliderControl.prototype.addedToDom = function() {
        var input;
        RangeSliderControl.__super__.addedToDom.call(this);
        input = this.inputs();
        $('<div/>').addClass('slider-output').insertAfter(input);
        input.bind('slider:ready slider:changed', function(e, data) {
          return $(this).nextAll('.slider-output').html(data.value);
        });
        return input.simpleSlider({
          snap: true,
          range: [this.start, this.end],
          step: this.step
        });
      };

      return RangeSliderControl;

    })(controls.RangeControl);
    return $.echoforms.control(RangeSliderControl, {
      "export": true
    });
  })(jQuery, jQuery.echoforms.controls, window, document);

}).call(this);
