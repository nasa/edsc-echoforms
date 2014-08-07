(function() {
  describe('"tree" control', function() {
    var attrs, template;
    template = new FormTemplate("<form xmlns=\"http://echo.nasa.gov/v9/echoforms\"\n      xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n      targetNamespace=\"http://www.example.com/echoforms\">\n  <model>\n    <instance>\n      <prov:options xmlns:prov=\"http://www.example.com/orderoptions\">\n        <prov:reference />\n        {{model}}\n      </prov:options>\n    </instance>\n  </model>\n  <ui>\n    <input id=\"reference\" label=\"Reference value\" ref=\"prov:reference\" type=\"xs:string\"/>\n    <tree id=\"subset_datalayer_tree\" label=\"Choose datasets\" ref=\"prov:SUBSET_DATA_LAYERS\" required=\"false()\" type=\"xsd:string\" valueElementName=\"data_layer\" separator=\"/\">\n        <item value=\"GLAH01\">\n            <item label=\"Data_1HZ\" value=\"Data_1HZ_VAL\">\n                <help> help text </help>\n                <item label=\"Parameter: DS_UTCTime_1\" value=\"DS_UTCTime_1\"/>\n                <item label=\"Engineering\" value=\"Engineering\">\n                    <item label=\"Parameter: d_T_detID\" value=\"d_T_detID_VAL\"/>\n                    <item label=\"Parameter: d_T_detID\" value=\"d_T_detID_VAL_2\"/>\n                </item>\n            </item>\n            <item label=\"Data_40HZ\" value=\"Data_40HZ_VAL\"/>\n        </item>\n        <item value=\"GLAH02\"/>\n    </tree>\n    {{ui}}\n  </ui>\n</form>");
    it("displays as an html select element", function() {
      template.form(dom);
      return expect($('#control :jstree *')).toBeMatchedBy('ul');
    });
    sharedBehaviorForControls(template);
    attrs = 'ref="prov:treeReference" valueElementName="data_layer"';
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
      return expect($('#control').find("prov\\:treeReference[type='tree'] >> prov\\:data_layer")[0].text()).toBe("/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL");
    });
    it("updates the model when selections change", function() {
      var model;
      model = "<prov:treeReference></prov:treeReference>";
      template.form(dom, {
        model: model,
        attributes: attrs
      });
      $(":jstree li[node_value='/GLAH01/Data_40HZ_VAL'] > a ").each(function() {
        return $(this).click();
      });
      return expect($('#control').find("prov\\:treeReference[type='tree'] >> prov\\:data_layer")[0].text()).toBe("/GLAH01/Data_40HZ_VAL");
    });
    return it("properly populates the label property when not provided", function() {
      var model, ui;
      model = "<prov:treeReference></prov:treeReference>";
      ui = "<tree id=\"referenceSelect\" " + attrs + ">\n  <item value=\"value_with_label\" label=\"a label\"/>\n  <item value=\"value_with_empty_label\" label = \"\"/>\n  <item value=\"value_with_no_label\"/>\n</tree>";
      template.form(dom, {
        model: model,
        attributes: attrs,
        ui: ui
      });
      expect($('#referenceSelect li[node_value="value_with_label"]').text()).toEqual('a label');
      expect($('#referenceSelect li[node_value="value_with_empty_label"]').text()).toEqual('value_with_empty_label');
      return expect($('#referenceSelect li[node_value="value_with_no_label"]').text()).toEqual('value_with_no_label');
    });
  });

}).call(this);
