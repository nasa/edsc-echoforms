(function() {
  describe('"secret" control', function() {
    var template;
    template = new FormTemplate("<form xmlns=\"http://echo.nasa.gov/v9/echoforms\"\n      xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n      targetNamespace=\"http://www.example.com/echoforms\">\n  <model>\n    <instance>\n      <prov:options xmlns:prov=\"http://www.example.com/orderoptions\">\n        <prov:reference />\n        {{model}}\n      </prov:options>\n    </instance>\n  </model>\n  <ui>\n    <input id=\"reference\" label=\"Reference value\" ref=\"prov:reference\" type=\"xs:string\"/>\n    <secret id=\"control\" {{attributes}}>\n      {{children}}\n    </secret>\n  </ui>\n</form>");
    it("displays as an html password input element", function() {
      template.form(dom);
      return expect($('#control :input')).toBeMatchedBy('input[type=password]');
    });
    sharedBehaviorForControls(template);
    return sharedBehaviorForTypedControls(template);
  });

}).call(this);
