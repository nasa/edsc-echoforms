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
    it("will not allow irrelevant nodes to be selected", function() {
      var children, form, model;
      model = "<prov:treeReference type=\"tree\">\n  <prov:data_layer></prov:data_layer>\n</prov:treeReference>";
      children = "<item value=\"irrelevantNode\" relevant=\"false()\"/>\n<item value=\"relevantNode\" relevant=\"true()\"/>";
      form = template.form(dom, {
        model: model,
        attributes: attrs,
        children: children
      });
      $(":jstree li[node_value = '/irrelevantNode'] > a ").each(function() {
        return $(this).click();
      });
      $(":jstree li[node_value = '/relevantNode'] > a ").each(function() {
        return $(this).click();
      });
      expect($('.jstree-clicked').parent().attr('node_value')).not.toMatch("irrelevantNode");
      expect($('.jstree-clicked').parent().attr('node_value')).toMatch("relevantNode");
      expect(form.echoforms('serialize')).not.toMatch(/irrelevantNode/);
      return expect(form.echoforms('serialize')).toMatch(/relevantNode/);
    });
    it("excludes from output any preselected nodes which are not relevant", function() {
      var children, model;
      model = "<prov:treeReference type=\"tree\">\n  <prov:data_layer>/irrelevantNode</prov:data_layer>\n</prov:treeReference>";
      children = "<item value=\"irrelevantNode\" relevant=\"false()\"/>";
      template.form(dom, {
        model: model,
        attributes: attrs,
        children: children
      });
      expect($('.jstree-clicked').parent().attr('node_value')).not.toMatch("/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL");
      return expect($('.jstree-clicked').parent().attr('node_value')).not.toMatch("irrelevantNode");
    });
    it("automatically selects required nodes", function() {
      var children, model;
      model = "<prov:treeReference type=\"tree\">\n  <prov:data_layer></prov:data_layer>\n</prov:treeReference>";
      children = "<item value=\"requiredNode\" required=\"true()\"/>";
      template.form(dom, {
        model: model,
        attributes: attrs,
        children: children
      });
      return expect($('.jstree-clicked').parent().attr('node_value')).toMatch("requiredNode");
    });
    it("relevancy takes precedence over required", function() {
      var children, form, model;
      model = "<prov:treeReference type=\"tree\">\n  <prov:data_layer></prov:data_layer>\n</prov:treeReference>";
      children = "<item value=\"requiredIrrelevantNode\" required=\"true()\" relevant=\"false()\"/>";
      form = template.form(dom, {
        model: model,
        attributes: attrs,
        children: children
      });
      return expect(form.echoforms('serialize')).not.toMatch(/requiredIrrelevantNode/);
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
    it("includes nodes in output which are selected but hidden", function() {
      var form, model;
      model = "<prov:treeReference></prov:treeReference>";
      form = template.form(dom, {
        model: model,
        attributes: attrs
      });
      $(':jstree').jstree('open_all');
      $(":jstree li[node_value='/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL_2'] > a ").each(function() {
        return $(this).click();
      });
      $(':jstree').jstree('close_all');
      return expect(form.echoforms('serialize')).toMatch(/\/GLAH01\/Data_1HZ_VAL\/Engineering\/d_T_detID_VAL_2/);
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
    describe("'separator' option", function() {
      var model;
      model = "<prov:treeReference type=\"tree\">\n  <prov:data_layer>/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL</prov:data_layer>\n  <prov:data_layer>Engineering</prov:data_layer>\n</prov:treeReference>";
      it("should add the provided value to the model if no separator specified", function() {
        var form;
        attrs = 'ref="prov:treeReference" valueElementName="data_layer" cascade="false"';
        form = template.form(dom, {
          model: model,
          attributes: attrs
        });
        expect($('.jstree-clicked').size()).toEqual(1);
        expect(form.echoforms('serialize')).toMatch(/>Engineering</);
        $(':jstree').jstree('open_all');
        $(":jstree li[node_value='Data_40HZ_VAL'] > a ").each(function() {
          return $(this).click();
        });
        expect($('.jstree-clicked').size()).toEqual(2);
        return expect(form.echoforms('serialize')).toMatch(/>Data_40HZ_VAL</);
      });
      return it("should generate and add a path to the model if a separator is specified", function() {
        var form;
        attrs = 'ref="prov:treeReference" valueElementName="data_layer" separator="\/" cascade="false"';
        form = template.form(dom, {
          model: model,
          attributes: attrs
        });
        expect($('.jstree-clicked').size()).toEqual(1);
        expect(form.echoforms('serialize')).toMatch(/>\/GLAH01\/Data_1HZ_VAL\/Engineering\/d_T_detID_VAL</);
        $(':jstree').jstree('open_all');
        $(":jstree li[node_value='/GLAH01/Data_40HZ_VAL'] > a ").each(function() {
          return $(this).click();
        });
        expect($('.jstree-clicked').size()).toEqual(2);
        return expect(form.echoforms('serialize')).toMatch(/>\/GLAH01\/Data_40HZ_VAL</);
      });
    });
    describe("'cascade' option", function() {
      var model;
      model = "<prov:treeReference type=\"tree\">\n  <prov:data_layer>/GLAH01/Data_1HZ_VAL/Engineering</prov:data_layer>\n</prov:treeReference>";
      it("should select all child nodes of selected node when cascade = true", function() {
        var form;
        attrs = 'ref="prov:treeReference" valueElementName="data_layer" separator="\/" cascade="true"';
        form = template.form(dom, {
          model: model,
          attributes: attrs
        });
        $(':jstree').jstree('open_all');
        expect($('.jstree-clicked').size()).toEqual(3);
        $(":jstree li[node_value='/GLAH01/Data_1HZ_VAL'] > a ").each(function() {
          return $(this).click();
        });
        return expect($('.jstree-clicked').size()).toEqual(5);
      });
      return it("should select only selected node when cascade = false", function() {
        var form;
        attrs = 'ref="prov:treeReference" valueElementName="data_layer" separator="\/" cascade="false"';
        form = template.form(dom, {
          model: model,
          attributes: attrs
        });
        $(':jstree').jstree('open_all');
        expect($('.jstree-clicked').size()).toEqual(1);
        $(":jstree li[node_value='/GLAH01/Data_1HZ_VAL'] > a ").each(function() {
          return $(this).click();
        });
        return expect($('.jstree-clicked').size()).toEqual(2);
      });
    });
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
