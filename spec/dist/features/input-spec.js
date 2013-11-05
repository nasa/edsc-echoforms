(function() {
  describe('"input" control', function() {
    var template;
    template = new FormTemplate("<form xmlns=\"http://echo.nasa.gov/v9/echoforms\"\n      xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n      targetNamespace=\"http://www.example.com/echoforms\">\n  <model>\n    <instance>\n      <prov:options xmlns:prov=\"http://www.example.com/orderoptions\">\n        <prov:reference />\n        {{model}}\n      </prov:options>\n    </instance>\n  </model>\n  <ui>\n    <input id=\"reference\" label=\"Reference value\" ref=\"prov:reference\" type=\"xs:string\"/>\n    <input id=\"control\" label=\"Input\" {{attributes}}>\n      {{children}}\n    </input>\n  </ui>\n</form>");
    it("displays as an html text input element", function() {
      template.form(dom);
      return expect($('#control :input')).toBeMatchedBy('input[type=text]');
    });
    sharedBehaviorForControls(template);
    sharedBehaviorForTypedControls(template);
    return describe('with type="xs:boolean"', function() {
      it("displays a checkbox instead of a text input", function() {
        template.form(dom, {
          attributes: 'type="xs:boolean"'
        });
        expect($('#control :checkbox')).toExist();
        return expect($('#control :checkbox')).not.toBeChecked();
      });
      it("loads boolean true values from the model", function() {
        template.form(dom, {
          attributes: 'type="xs:boolean" ref="prov:boolean"',
          model: '<prov:boolean>true</prov:boolean>'
        });
        return expect($('#control :checkbox')).toBeChecked();
      });
      it("loads boolean false values from the model", function() {
        template.form(dom, {
          attributes: 'type="xs:boolean" ref="prov:boolean"',
          model: '<prov:boolean>false</prov:boolean>'
        });
        return expect($('#control :checkbox')).not.toBeChecked();
      });
      it("copes with non-boolean values in the model", function() {
        template.form(dom, {
          attributes: 'type="xs:boolean" ref="prov:boolean"',
          model: '<prov:boolean>asdf</prov:boolean>'
        });
        return expect($('#control :checkbox')).not.toBeChecked();
      });
      it("updates its checkbox's checked state when the model updates", function() {
        template.form(dom, {
          attributes: 'type="xs:boolean" ref="prov:reference"'
        });
        expect($('#control :checkbox')).not.toBeChecked();
        $('#reference :input').val('true').change();
        expect($('#control :checkbox')).toBeChecked();
        $('#reference :input').val('false').change();
        return expect($('#control :checkbox')).not.toBeChecked();
      });
      return it("updates the model based on its checked state", function() {
        template.form(dom, {
          attributes: 'type="xs:boolean" ref="prov:reference"'
        });
        expect($('#reference :input').val()).toBe('');
        $('#control :input').attr('checked', true).change();
        expect($('#reference :input').val()).toBe('true');
        $('#control :input').attr('checked', false).change();
        return expect($('#reference :input').val()).toBe('false');
      });
    });
  });

}).call(this);
