(function() {
  describe('"tree" control', function() {
    var attrs, template;
    template = new FormTemplate("<form xmlns=\"http://echo.nasa.gov/v9/echoforms\"\n      xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n      targetNamespace=\"http://www.example.com/echoforms\">\n  <model>\n    <instance>\n      <prov:options xmlns:prov=\"http://www.example.com/orderoptions\">\n        <prov:reference />\n        {{model}}\n      </prov:options>\n    </instance>\n  </model>\n  <ui>\n    <input id=\"reference\" label=\"Reference value\" ref=\"prov:reference\" type=\"xs:string\"/>\n    <tree id=\"control\" {{attributes}}>\n        <item value=\"GLAH01\">\n            <item label=\"Data_1HZ\" value=\"Data_1HZ_VAL\">\n                <help> help text </help>\n                <item label=\"Parameter: DS_UTCTime_1\" value=\"DS_UTCTime_1\"/>\n                <item label=\"Engineering\" value=\"Engineering\">\n                    <item label=\"Parameter: d_T_detID\" value=\"d_T_detID_VAL\"/>\n                    <item label=\"Parameter: d_T_detID\" value=\"d_T_detID_VAL_2\"/>\n                </item>\n            </item>\n            <item label=\"Data_40HZ\" value=\"Data_40HZ_VAL\"/>\n        </item>\n        <item value=\"GLAH02\"/>\n        {{children}}\n    </tree>\n    {{ui}}\n  </ui>\n</form>");
    it("displays as an html div element", function() {
      template.form(dom);
      return expect($(':jstree')).toBeMatchedBy('div');
    });
    sharedBehaviorForControls(template, {
      skip_input_specs: true
    });
    attrs = 'ref="prov:treeReference" valueElementName="data_layer" separator="\/"';
    it("defaults to no selections", function() {
      var model;
      return model = "<prov:treeReference></prov:treeReference>";
    });
    it("reads selections from the model", function() {
      var model;
      model = "<prov:treeReference type=\"tree\">\n  <prov:data_layer>/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL</prov:data_layer>\n</prov:treeReference>";
      template.form(dom, {
        model: model,
        attributes: attrs
      });
      return expect($('.jstree-clicked').parent().attr('node_value')).toBe("/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL");
    });
    it("updates the model when selections change", function() {
      var model;
      model = "<prov:treeReference></prov:treeReference>";
      template.form(dom, {
        model: model,
        attributes: attrs
      });
      $(':jstree').jstree('open_all');
      $(":jstree li[node_value='/GLAH01/Data_40HZ_VAL'] > a ").each(function() {
        return $(this).click();
      });
      return expect($('.jstree-clicked').parent().attr('node_value')).toBe("/GLAH01/Data_40HZ_VAL");
    });
    describe("label property", function() {
      return it("properly populates the label property when not provided", function() {
        var model, ui;
        model = "<prov:treeReference></prov:treeReference>";
        ui = "<tree id=\"referenceSelect\" " + attrs + ">\n  <item value=\"value_with_label\" label=\"a label\"/>\n  <item value=\"value_with_empty_label\" label = \"\"/>\n  <item value=\"value_with_no_label\"/>\n</tree>";
        template.form(dom, {
          model: model,
          attributes: attrs,
          ui: ui
        });
        expect($(':jstree li[node_value="/value_with_label"]').text()).toEqual('a label');
        expect($(':jstree li[node_value="/value_with_empty_label"]').text()).toEqual('value_with_empty_label');
        return expect($(':jstree li[node_value="/value_with_no_label"]').text()).toEqual('value_with_no_label');
      });
    });
    describe("'cascade' option", function() {});
    describe("'separator' option", function() {});
    return describe("other test cases", function() {
      var model;
      model = "<prov:treeReference type=\"tree\">\n</prov:treeReference>\n<prov:treeReference2 type=\"tree\">\n</prov:treeReference2>";
      return it("handles multiple identical trees", function() {
        var form, ui;
        attrs = 'valueElementName="data_layer" separator="\/"';
        ui = "<tree id=\"duplicate_test\" " + attrs + " ref='prov:treeReference'>\n  <item value=\"value_with_label\" label=\"a label\"/>\n  <item value=\"value_with_empty_label\" label = \"\"/>\n  <item value=\"value_with_no_label\"/>\n</tree>\n<tree id=\"duplicate_test\" " + attrs + " ref='prov:treeReference2'>\n  <item value=\"value_with_label\" label=\"a label\"/>\n  <item value=\"value_with_empty_label\" label = \"\"/>\n  <item value=\"value_with_no_label\"/>\n</tree>";
        form = template.form(dom, {
          model: model,
          attributes: attrs,
          ui: ui
        });
        expect($(':jstree').size()).toEqual(3);
        expect($(':jstree').filter(function() {
          return /duplicate_test/.test(this.id);
        }).size()).toEqual(2);
        $($(":jstree")[1]).find("li[node_value='/value_with_label'] > a").each(function() {
          return $(this).click();
        });
        $($(":jstree")[2]).find("li[node_value='/value_with_no_label'] > a").each(function() {
          return $(this).click();
        });
        expect($('.jstree-clicked').size()).toEqual(2);
        expect($($('.jstree-clicked')[0]).parent().attr('node_value')).toBe("/value_with_label");
        expect($($('.jstree-clicked')[1]).parent().attr('node_value')).toBe("/value_with_no_label");
        expect(form.echoforms('serialize')).toMatch(/value_with_label/);
        return expect(form.echoforms('serialize')).toMatch(/value_with_no_label/);
      });
    });
  });

}).call(this);
