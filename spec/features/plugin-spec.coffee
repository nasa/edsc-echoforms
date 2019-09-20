describe 'jQuery plugin', ->
  template = new FormTemplate("""
    <form xmlns="http://echo.nasa.gov/v9/echoforms"
          xmlns:xs="http://www.w3.org/2001/XMLSchema"
          targetNamespace="http://www.example.com/echoforms">
      <model>
        <instance>
          <prov:options xmlns:prov="http://www.example.com/orderoptions">
            <prov:reference />
          </prov:options>
        </instance>
      </model>
      <ui>
        <input id="reference" label="Reference value" ref="prov:reference" type="xs:string" {{attributes}}/>
      </ui>
    </form>
  """)

  describe '"destroy" method', ->
    it 'removes the ECHO Form from the DOM', ->
      template.form($('#dom'))
      expect($('#dom')).not.toBeEmpty()
      $('#dom').echoforms('destroy')
      expect($('#dom')).toBeEmpty()

  describe '"isValid" method', ->
    it "returns a boolean indicating whether the form has validation errors", ->
      template.form($('#dom'), attributes: 'required="true()"')
      expect($('#dom').echoforms('isValid')).toBe(false)
      $('#reference :input').val('some value').change()
      expect($('#dom').echoforms('isValid')).toBe(true)
      $('#reference :input').val('').change()
      expect($('#dom').echoforms('isValid')).toBe(false)

  describe '"serialize" method', ->
    it "returns the model's serialized XML string", ->
      template.form($('#dom'))
      $('#reference :input').val('some value').change()
      expect($('#dom').echoforms('serialize')).toMatchXml '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:reference>some value</prov:reference></prov:options>'

    it "prunes irrelevant values from the serialized XML", ->
      template.form($('#dom'), attributes: 'relevant="false()"')
      $('#reference :input').val('some value').change()
      expect($('#dom').echoforms('serialize')).toMatchXml """
        <prov:options xmlns:prov="http://www.example.com/orderoptions">
        </prov:options>
      """
