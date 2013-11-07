(function() {
  beforeEach(function() {
    return this.addMatchers({
      toHaveHelp: function(expected) {
        var actual, el, help, id, matched, messages, result, _i, _len;
        actual = this.actual;
        if (!(actual instanceof Array)) {
          actual = [actual];
        }
        messages = [];
        result = !this.isNot;
        for (_i = 0, _len = actual.length; _i < _len; _i++) {
          id = actual[_i];
          el = $("#" + id);
          if (el.is('.echoforms-control')) {
            help = el.children('.echoforms-help');
            matched = $.trim(help.text()) === expected;
            if (matched && this.isNot) {
              result = true;
              messages.push("Expected '" + id + "' to not have help text '" + expected + "'");
            }
            if (!matched && !this.isNot) {
              result = false;
              messages.push("Expected '" + id + "' to have help text '" + expected + "'");
            }
          } else {
            result = this.isNot;
            messages.push("Could not find element of class 'echoforms-control' with id '" + id + "'");
          }
        }
        this.message = function() {
          return messages.join('. ');
        };
        return result;
      },
      toHaveError: function(expected) {
        var control, message, _i, _len, _ref;
        control = $(this.actual);
        _ref = control.children('.echoforms-errors').children('.echoforms-error');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          message = _ref[_i];
          if ($.trim($(message).text()) === expected || (expected == null)) {
            return true;
          }
        }
        return false;
      },
      toBeReadonly: function() {
        var control;
        control = $(this.actual);
        return control.is('.echoforms-readonly') && control.find(':input').not('[readonly]').length === 0;
      },
      toMatchXml: function(expected) {
        var actual;
        expected = expected.replace(/\s+/g, ' ').replace('> <', '><');
        actual = this.actual.replace(/\s+/g, ' ').replace('> <', '><');
        return expected === actual;
      }
    });
  });

}).call(this);
