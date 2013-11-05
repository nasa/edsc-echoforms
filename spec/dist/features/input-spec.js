(function() {
  describe('Input control', function() {
    var template;
    template = new FormTemplate("<form xmlns=\"http://echo.nasa.gov/v9/echoforms\"\n      xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n      targetNamespace=\"http://www.example.com/echoforms\">\n  <model>\n    <instance>\n      <prov:options xmlns:prov=\"http://www.example.com/orderoptions\">\n        <prov:reference />\n        {{model}}\n      </prov:options>\n    </instance>\n  </model>\n  <ui>\n    <input id=\"reference\" label=\"Reference value\" ref=\"prov:reference\" type=\"xs:string\"/>\n    <input id=\"control\" label=\"Input\" {{attributes}}>\n      {{children}}\n    </input>\n  </ui>\n</form>");
    sharedBehaviorForControls(template);
    sharedBehaviorForTypedControls(template);
    describe('"relevant" attribute', function() {});
    describe('"required" attribute', function() {});
    describe('"readonly" attribute', function() {});
    return describe('validation', function() {
      describe('"pattern" constraint', function() {});
      return describe('"xpath" constraint', function() {});
    });
  });

}).call(this);
