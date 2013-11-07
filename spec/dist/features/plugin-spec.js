(function() {
  describe('jQuery plugin', function() {
    var template;
    template = new FormTemplate("<form xmlns=\"http://echo.nasa.gov/v9/echoforms\"\n      xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n      targetNamespace=\"http://www.example.com/echoforms\">\n  <model>\n    <instance>\n      <prov:options xmlns:prov=\"http://www.example.com/orderoptions\">\n        <prov:reference />\n      </prov:options>\n    </instance>\n  </model>\n  <ui>\n    <input id=\"reference\" label=\"Reference value\" ref=\"prov:reference\" type=\"xs:string\" {{attributes}}/>\n  </ui>\n</form>");
    describe('"destroy" method', function() {
      return it('removes the ECHO Form from the DOM', function() {
        template.form(dom);
        expect(dom).not.toBeEmpty();
        dom.echoforms('destroy');
        return expect(dom).toBeEmpty();
      });
    });
    describe('"isValid" method', function() {
      return it("returns a boolean indicating whether the form has validation errors", function() {
        template.form(dom, {
          attributes: 'required="true()"'
        });
        expect(dom.echoforms('isValid')).toBe(false);
        $('#reference :input').val('some value').change();
        expect(dom.echoforms('isValid')).toBe(true);
        $('#reference :input').val('').change();
        return expect(dom.echoforms('isValid')).toBe(false);
      });
    });
    return describe('"serialize" method', function() {
      it("returns the model's serialized XML string", function() {
        template.form(dom);
        $('#reference :input').val('some value').change();
        return expect(dom.echoforms('serialize')).toMatchXml("<prov:options xmlns:prov=\"http://www.example.com/orderoptions\">\n  <prov:reference>some value</prov:reference>\n</prov:options>");
      });
      return it("prunes irrelevant values from the serialized XML", function() {
        template.form(dom, {
          attributes: 'relevant="false()"'
        });
        $('#reference :input').val('some value').change();
        return expect(dom.echoforms('serialize')).toMatchXml("<prov:options xmlns:prov=\"http://www.example.com/orderoptions\">\n</prov:options>");
      });
    });
  });

}).call(this);
