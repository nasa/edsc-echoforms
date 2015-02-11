describe '"select" control', ->
  # Selects with open="true" are not currently implemented, since they are unused in ops

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
        <select id="control" {{attributes}}>
          <!-- The following are used by sharedBehaviorForControls specs -->
          <item value="value"/>
          <item value="alphabetic"/>
          <item value="Default value"/>
          <item value="12345"/>
          {{children}}
        </select>
        {{ui}}
      </ui>
    </form>
  """)

  it "displays as an html select element", ->
    template.form(dom)
    expect($('#control :input')).toBeMatchedBy('select')

  sharedBehaviorForControls(template)

  describe '"multiple" attribute', ->
    attrs = 'ref="prov:selectReference" valueElementName="selectValue" multiple="true"'

    it "defaults to no selections", ->
      model = "<prov:selectReference></prov:selectReference>"

    it "reads selections from the model", ->
      model = """
        <prov:selectReference>
          <prov:selectValue>value</prov:selectValue>
          <prov:selectValue>12345</prov:selectValue>
        </prov:selectReference>
      """
      template.form(dom, model: model, attributes: attrs)
      expect($('#control :input').val()).toEqual(['value', '12345'])


    it "updates the model when selections change", ->
      model = "<prov:selectReference></prov:selectReference>"
      ui = """
        <select id="referenceSelect" #{attrs}>
          <item value="value"/>
          <item value="alphabetic"/>
          <item value="Default value"/>
          <item value="12345"/>
        </select>
      """
      template.form(dom, model: model, attributes: attrs, ui: ui)
      $('#control :input').val(['value', '12345']).change()
      expect($('#referenceSelect :input').val()).toEqual(['value', '12345'])


  describe '"valueElementName" attribute for single selects', ->
    attrs = 'ref="prov:selectReference" valueElementName="selectValue"'

    it "defaults to no selections", ->
      model = "<prov:selectReference></prov:selectReference>"
      template.form(dom, model: model, attributes: attrs)

    it "reads selections from the model", ->
      model = """
        <prov:selectReference>
          <prov:selectValue>alphabetic</prov:selectValue>
        </prov:selectReference>
      """
      template.form(dom, model: model, attributes: attrs)
      expect($('#control :input').val()).toEqual('alphabetic')

    it "updates the model when selections change", ->
      model = "<prov:selectReference></prov:selectReference>"
      ui = """
        <select id="referenceSelect" #{attrs}>
          <item value="value"/>
          <item value="alphabetic"/>
          <item value="Default value"/>
          <item value="12345"/>
        </select>
      """
      template.form(dom, model: model, attributes: attrs, ui: ui)
      $('#control :input').val('alphabetic').change()
      expect($('#referenceSelect :input').val()).toEqual('alphabetic')

  describe 'When label is undefined', ->
    attrs = 'ref="prov:selectReference" valueElementName="selectValue"'

    it "properly populates the label property", ->
      model = "<prov:selectReference></prov:selectReference>"
      ui = """
          <select id="referenceSelect" #{attrs}>
            <item value="value_with_label" label="a label"/>
            <item value="value_with_empty_label" label = ""/>
            <item value="value_with_no_label"/>
          </select>
        """
      template.form(dom, model: model, attributes: attrs, ui: ui)
      expect($('#referenceSelect select > option[value="value_with_label"]').text()).toEqual('a label')
      expect($('#referenceSelect select > option[value="value_with_empty_label"]').text()).toEqual('value_with_empty_label')
      expect($('#referenceSelect select > option[value="value_with_no_label"]').text()).toEqual('value_with_no_label')

  describe '"Blank" option behavior', ->

    it "adds a '-- Select a value --' option if the select is required and there is no blank option or default provided", ->
      attrs = 'ref="prov:selectReference" valueElementName="selectValue" required="true"'
      model = "<prov:selectReference></prov:selectReference>"
      template.form(dom, model: model, attributes: attrs)
      expect($('#control select > option[value=""]').text()).toEqual(' -- Select a value -- ')

    it "does not add a '-- Select a value --' option if the select is required but there is a blank option provided", ->
      attrs = 'ref="prov:selectReference" valueElementName="selectValue" required="true"'
      children = "<item value='' label='empty'/>"
      model = "<prov:selectReference></prov:selectReference>"
      template.form(dom, model: model, attributes: attrs, children: children)
      expect($('#control select > option[value=""]').text()).toEqual('empty')

    it "does not add a '-- Select a value --' option if the select is required but there is a default value provided", ->
      attrs = 'ref="prov:selectReference" valueElementName="selectValue" required="true"'
      model = "<prov:selectReference><prov:selectValue>default value</prov:selectValue></prov:selectReference>"
      template.form(dom, model: model, attributes: attrs)
      expect($('#control select > option[value=""]').text()).toEqual('')

    it "gives an error if the select is required, but the default value is ''", ->
      attrs = 'ref="prov:selectReference" valueElementName="selectValue" required="true"'
      model = "<prov:selectReference></prov:selectReference>"
      children = "<item value='' label='empty'/>"
      template.form(dom, model: model, attributes: attrs, children: children)
      expect($('#control select > option[value=""]').text()).toEqual('empty')
      expect('#control').toHaveError('Required field')

    it "adds a '-- No Selection --' option if the select is not required and there is no blank option or default provided", ->
      attrs = 'ref="prov:selectReference" valueElementName="selectValue" required="false"'
      model = "<prov:selectReference></prov:selectReference>"
      template.form(dom, model: model, attributes: attrs)
      expect($('#control select > option[value=""]').text()).toEqual(' -- No Selection -- ')

    it "does not add a '-- No Selection--' option if the select is not required but there is a blank option provided", ->
      attrs = 'ref="prov:selectReference" valueElementName="selectValue" required="true"'
      children = "<item value='' label='empty'/>"
      model = "<prov:selectReference></prov:selectReference>"
      template.form(dom, model: model, attributes: attrs, children: children)
      expect($('#control select > option[value=""]').text()).toEqual('empty')

    it "does not add a '-- No Selection--' option if the select is not required but there is a default value provided", ->
      attrs = 'ref="prov:selectReference" valueElementName="selectValue" required="true"'
      model = "<prov:selectReference><prov:selectValue>default value</prov:selectValue></prov:selectReference>"
      template.form(dom, model: model, attributes: attrs)
      expect($('#control select > option[value=""]').text()).toEqual('')
