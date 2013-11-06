(function() {
  describe('"group" control', function() {
    var template;
    template = new FormTemplate("<form xmlns=\"http://echo.nasa.gov/v9/echoforms\"\n      xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n      targetNamespace=\"http://www.example.com/echoforms\">\n  <model>\n    <instance>\n      <prov:options xmlns:prov=\"http://www.example.com/orderoptions\">\n        <prov:reference/>\n        <prov:parentReference>\n          <prov:childReference>{{childValue}}</prov:childReference>\n        </prov:parentReference>\n        {{model}}\n      </prov:options>\n    </instance>\n  </model>\n  <ui>\n    <input id=\"reference\" label=\"Reference value\" ref=\"prov:reference\" type=\"xs:string\"/>\n    <input id=\"childReference\" label=\"Reference value\" ref=\"prov:parentReference/prov:childReference\" type=\"xs:string\"/>\n    <group id=\"control\" ref=\"prov:parentReference\" {{attributes}}>\n      <input id=\"child\" ref=\"prov:childReference\" {{childAttributes}}>\n        {{grandchildren}}\n      </input>\n      {{children}}\n    </group>\n  </ui>\n</form>");
    sharedBehaviorForControls(template, {
      skip_input_specs: true
    });
    return sharedBehaviorForGroupingControls(template);
  });

}).call(this);
