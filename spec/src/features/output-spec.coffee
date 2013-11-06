describe '"output" control', ->
  template = new FormTemplate("""
    <form xmlns="http://echo.nasa.gov/v9/echoforms"
          xmlns:xs="http://www.w3.org/2001/XMLSchema"
          targetNamespace="http://www.example.com/echoforms">
      <model>
        <instance>
          <prov:options xmlns:prov="http://www.example.com/orderoptions">
            <prov:reference />
            {{model}}
          </prov:options>
        </instance>
      </model>
      <ui>
        <input id="reference" label="Reference value" ref="prov:reference" type="xs:string"/>
        <output id="control" {{attributes}}>
          {{children}}
        </output>
      </ui>
    </form>
  """)

  sharedBehaviorForControls(template, skip_input_specs: true)

  describe "focus", ->

    it 'displays the value produced by its "ref" attribute', ->
      template.form(dom,
        model: '<prov:default>Default value</prov:default>',
        attributes: 'ref="prov:default"')
      expect($('#control > .echoforms-elements > p')).toHaveText('Default value')


    describe '"value" attribute', ->
      it 'displays the value interpreted as a string', ->
        template.form(dom,
          attributes: 'value="\'String value\'"')
        expect($('#control > .echoforms-elements > p')).toHaveText('String value')

      it 'performs xpath expressions on the value', ->
        template.form(dom,
          attributes: 'value="concat(string(\'Your order contains \'), 5, string(\' items.\'))"')
        expect($('#control > .echoforms-elements > p')).toHaveText('Your order contains 5 items.')

    describe 'with type="xs:anyuri"', ->
      it 'displays a hyperlink with text and href obtained from its "ref" attribute', ->
        template.form(dom,
          model: '<prov:default>#uri</prov:default>',
          attributes: 'type="xs:anyURI" ref="prov:default"')
        expect($('#control > .echoforms-elements > a')).toHaveText('#uri')
        expect($('#control > .echoforms-elements > a')).toHaveAttr('href', '#uri')

      it 'displays a hyperlink with text and href obtained from its "value" attribute', ->
        template.form(dom,
          attributes: 'type="xs:anyURI" value="\'#uri\'"')
        expect($('#control > .echoforms-elements > a')).toHaveText('#uri')
        expect($('#control > .echoforms-elements > a')).toHaveAttr('href', '#uri')
