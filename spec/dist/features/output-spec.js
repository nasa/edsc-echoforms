(function() {
  describe('"output" control', function() {
    var template;
    template = new FormTemplate("<form xmlns=\"http://echo.nasa.gov/v9/echoforms\"\n      xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n      targetNamespace=\"http://www.example.com/echoforms\">\n  <model>\n    <instance>\n      <prov:options xmlns:prov=\"http://www.example.com/orderoptions\">\n        <prov:reference />\n        {{model}}\n      </prov:options>\n    </instance>\n  </model>\n  <ui>\n    <input id=\"reference\" label=\"Reference value\" ref=\"prov:reference\" type=\"xs:string\"/>\n    <output id=\"control\" {{attributes}}>\n      {{children}}\n    </output>\n  </ui>\n</form>");
    sharedBehaviorForControls(template, {
      skip_input_specs: true
    });
    return describe("focus", function() {
      it('displays the value produced by its "ref" attribute', function() {
        template.form(dom, {
          model: '<prov:default>Default value</prov:default>',
          attributes: 'ref="prov:default"'
        });
        return expect($('#control > .echoforms-elements > p')).toHaveText('Default value');
      });
      describe('"value" attribute', function() {
        it('displays the value interpreted as a string', function() {
          template.form(dom, {
            attributes: 'value="\'String value\'"'
          });
          return expect($('#control > .echoforms-elements > p')).toHaveText('String value');
        });
        return it('performs xpath expressions on the value', function() {
          template.form(dom, {
            attributes: 'value="concat(string(\'Your order contains \'), 5, string(\' items.\'))"'
          });
          return expect($('#control > .echoforms-elements > p')).toHaveText('Your order contains 5 items.');
        });
      });
      return describe('with type="xs:anyuri"', function() {
        it('displays a hyperlink with text and href obtained from its "ref" attribute', function() {
          template.form(dom, {
            model: '<prov:default>#uri</prov:default>',
            attributes: 'type="xs:anyURI" ref="prov:default"'
          });
          expect($('#control > .echoforms-elements > a')).toHaveText('#uri');
          return expect($('#control > .echoforms-elements > a')).toHaveAttr('href', '#uri');
        });
        return it('displays a hyperlink with text and href obtained from its "value" attribute', function() {
          template.form(dom, {
            attributes: 'type="xs:anyURI" value="\'#uri\'"'
          });
          expect($('#control > .echoforms-elements > a')).toHaveText('#uri');
          return expect($('#control > .echoforms-elements > a')).toHaveAttr('href', '#uri');
        });
      });
    });
  });

}).call(this);
