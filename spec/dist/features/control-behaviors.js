(function() {
  window.sharedBehaviorForControls = function(template) {
    it('is tagged as a control', function() {
      template.form(dom);
      return expect($('#control')).toHaveClass('echoforms-control');
    });
    it("displays help", function() {
      template.form(dom, {
        children: '<help>Helpful text</help>'
      });
      return expect($('#control > .echoforms-help')).toBeVisible();
    });
    describe('"relevant" attribute', function() {
      it("contains an xpath which hides the control when it evaluates to false", function() {
        template.form(dom, {
          attributes: 'relevant="prov:reference != \'hidden\'"'
        });
        expect($('#control')).toBeVisible();
        $('#reference :input').val('hidden').change();
        expect($('#control')).toBeHidden();
        $('#reference :input').val('visible').change();
        return expect($('#control')).toBeVisible();
      });
      return it("may contain element selectors, which are interpreted as booleans", function() {
        template.form(dom, {
          attributes: 'relevant="[prov:reference!=\'hidden\']"'
        });
        expect($('#control')).toBeVisible();
        $('#reference :input').val('hidden').change();
        expect($('#control')).toBeHidden();
        $('#reference :input').val('visible').change();
        return expect($('#control')).toBeVisible();
      });
    });
    describe('"required" attribute', function() {
      it("contains an xpath which requires the control to have a value when it evaluates to true", function() {
        template.form(dom, {
          attributes: 'required="prov:reference=\'required\'"'
        });
        expect('#control').not.toHaveError('Required field');
        $('#reference :input').val('required').change();
        expect('#control').toHaveError('Required field');
        $('#reference :input').val('optional').change();
        return expect('#control').not.toHaveError('Required field');
      });
      return it("produces no error if the control has a non-empty value", function() {
        template.form(dom, {
          attributes: 'required="prov:reference=\'required\'"'
        });
        $('#reference :input').val('required').change();
        expect('#control').toHaveError('Required field');
        $('#control :input').val('value').change();
        expect('#control').not.toHaveError('Required field');
        $('#control :input').val('').change();
        return expect('#control').toHaveError('Required field');
      });
    });
    describe('"reaodnly" attribute', function() {
      return it("contains an xpath which causes the control to become readonly", function() {
        template.form(dom, {
          attributes: 'readonly="prov:reference=\'readonly\'"'
        });
        expect('#control').not.toBeReadonly();
        $('#reference :input').val('readonly').change();
        expect('#control').toBeReadonly();
        $('#reference :input').val('').change();
        return expect('#control').not.toBeReadonly();
      });
    });
    describe('"pattern" constriants', function() {
      var constraints;
      constraints = "<constraints>\n  <constraint>\n    <pattern>[0-9]+</pattern>\n    <alert>Must be numeric</alert>\n  </constraint>\n</constraints>";
      it("displays the given error message when the control's value does not match the given pattern", function() {
        template.form(dom, {
          children: constraints
        });
        $('#control :input').val('alphabetic').change();
        return expect('#control').toHaveError('Must be numeric');
      });
      it("displays no error when the control's value matches the given pattern", function() {
        template.form(dom, {
          children: constraints
        });
        $('#control :input').val('12345').change();
        return expect('#control').not.toHaveError('Must be numeric');
      });
      return it("displays no error when the control is left blank", function() {
        template.form(dom, {
          children: constraints
        });
        return expect('#control').not.toHaveError('Must be numeric');
      });
    });
    return describe('"xpath" constriants', function() {
      var constraints;
      constraints = "<constraints>\n  <constraint>\n    <xpath>prov:reference != 'invalid'</xpath>\n    <alert>Invalid!</alert>\n  </constraint>\n</constraints>";
      it("displays the given error message when the given XPath evaluates to false", function() {
        template.form(dom, {
          children: constraints
        });
        expect('#control').not.toHaveError('Invalid!');
        $('#reference :input').val('invalid').change();
        return expect('#control').toHaveError('Invalid!');
      });
      return it("displays no error when the given XPath evaluates to true", function() {
        template.form(dom, {
          children: constraints
        });
        $('#reference :input').val('valid').change();
        return expect('#control').not.toHaveError('Invalid!');
      });
    });
  };

}).call(this);
