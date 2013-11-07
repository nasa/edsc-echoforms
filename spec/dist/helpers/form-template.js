(function() {
  window.FormTemplate = (function() {
    function FormTemplate(template) {
      var match, re, variable;
      this.template = template;
      this.vars = [];
      re = /{{([^}]+)}}/g;
      while ((match = re.exec(this.template)) != null) {
        variable = match[1];
        if (this.vars.indexOf(variable) === -1) {
          this.vars.push(variable);
        }
      }
    }

    FormTemplate.prototype.xml = function(varmap) {
      var regexp, result, value, variable, _i, _len, _ref, _ref1;
      if (varmap == null) {
        varmap = {};
      }
      result = this.template;
      _ref = this.vars;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        variable = _ref[_i];
        regexp = new RegExp("{{" + variable + "}}", 'g');
        value = (_ref1 = varmap[variable]) != null ? _ref1 : '';
        result = result.replace(regexp, value);
      }
      return result;
    };

    FormTemplate.prototype.form = function(dom, varmap) {
      if (varmap == null) {
        varmap = {};
      }
      return dom.echoforms({
        form: this.xml(varmap)
      });
    };

    return FormTemplate;

  })();

}).call(this);
