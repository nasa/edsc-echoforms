(function() {
  describe('"select" control', function() {
    var template;
    template = new FormTemplate("<form xmlns=\"http://echo.nasa.gov/v9/echoforms\"\n      xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n      targetNamespace=\"http://www.example.com/echoforms\">\n  <model>\n    <instance>\n      <prov:options xmlns:prov=\"http://www.example.com/orderoptions\">\n        <prov:reference />\n        {{model}}\n      </prov:options>\n    </instance>\n  </model>\n  <ui>\n    <input id=\"reference\" label=\"Reference value\" ref=\"prov:reference\" type=\"xs:string\"/>\n    <select id=\"control\" {{attributes}}>\n      <!-- The following are used by sharedBehaviorForControls specs -->\n      <item value=\"value\"/>\n      <item value=\"alphabetic\"/>\n      <item value=\"Default value\"/>\n      <item value=\"12345\"/>\n      {{children}}\n    </select>\n    {{ui}}\n  </ui>\n</form>");
    it("displays as an html select element", function() {
      template.form(dom);
      return expect($('#control :input')).toBeMatchedBy('select');
    });
    sharedBehaviorForControls(template);
    describe('"multiple" attribute', function() {
      var attrs;
      attrs = 'ref="prov:selectReference" valueElementName="selectValue" multiple="true"';
      it("defaults to no selections", function() {
        var model;
        return model = "<prov:selectReference></prov:selectReference>";
      });
      it("reads selections from the model", function() {
        var model;
        model = "<prov:selectReference>\n  <prov:selectValue>value</prov:selectValue>\n  <prov:selectValue>12345</prov:selectValue>\n</prov:selectReference>";
        template.form(dom, {
          model: model,
          attributes: attrs
        });
        return expect($('#control :input').val()).toEqual(['value', '12345']);
      });
      return it("updates the model when selections change", function() {
        var model, ui;
        model = "<prov:selectReference></prov:selectReference>";
        ui = "<select id=\"referenceSelect\" " + attrs + ">\n  <item value=\"value\"/>\n  <item value=\"alphabetic\"/>\n  <item value=\"Default value\"/>\n  <item value=\"12345\"/>\n</select>";
        template.form(dom, {
          model: model,
          attributes: attrs,
          ui: ui
        });
        $('#control :input').val(['value', '12345']).change();
        return expect($('#referenceSelect :input').val()).toEqual(['value', '12345']);
      });
    });
    describe('"valueElementName" attribute for single selects', function() {
      var attrs;
      attrs = 'ref="prov:selectReference" valueElementName="selectValue"';
      it("defaults to no selections", function() {
        var model;
        model = "<prov:selectReference></prov:selectReference>";
        return template.form(dom, {
          model: model,
          attributes: attrs
        });
      });
      it("reads selections from the model", function() {
        var model;
        model = "<prov:selectReference>\n  <prov:selectValue>alphabetic</prov:selectValue>\n</prov:selectReference>";
        template.form(dom, {
          model: model,
          attributes: attrs
        });
        return expect($('#control :input').val()).toEqual('alphabetic');
      });
      return it("updates the model when selections change", function() {
        var model, ui;
        model = "<prov:selectReference></prov:selectReference>";
        ui = "<select id=\"referenceSelect\" " + attrs + ">\n  <item value=\"value\"/>\n  <item value=\"alphabetic\"/>\n  <item value=\"Default value\"/>\n  <item value=\"12345\"/>\n</select>";
        template.form(dom, {
          model: model,
          attributes: attrs,
          ui: ui
        });
        $('#control :input').val('alphabetic').change();
        return expect($('#referenceSelect :input').val()).toEqual('alphabetic');
      });
    });
    return describe('When label is undefined', function() {
      var attrs;
      attrs = 'ref="prov:selectReference" valueElementName="selectValue"';
      return it("populates teh label properly label ", function() {
        var model, ui;
        model = "<prov:selectReference></prov:selectReference>";
        ui = "<select id=\"referenceSelect\" " + attrs + ">\n  <item value=\"value_with_label\" label=\"a label\"/>\n  <item value=\"value_with_empty_label\" label = \"\"/>\n  <item value=\"value_with_no_label\"/>\n</select>";
        template.form(dom, {
          model: model,
          attributes: attrs,
          ui: ui
        });
        expect($('#referenceSelect select > option[value="value_with_label"]').attr("label")).toEqual('a label');
        expect($('#referenceSelect select > option[value="value_with_empty_label"]').attr("label")).toEqual('value_with_empty_label');
        return expect($('#referenceSelect select > option[value="value_with_no_label"]').attr("label")).toEqual('value_with_no_label');
      });
    });
  });

}).call(this);
