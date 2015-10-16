describe '"input" control', ->
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
        <input id="control" {{attributes}}>
          {{children}}
        </input>
      </ui>
    </form>
  """)

  it "displays as an html text input element", ->
    template.form($('#dom'))
    expect($('#control :input')).toBeMatchedBy('input[type=text]')

  sharedBehaviorForControls(template)
  sharedBehaviorForTypedControls(template)

  describe 'with type="xs:boolean"', ->
    it "displays a checkbox instead of a text input", ->
      template.form($('#dom'), attributes: 'type="xs:boolean"')
      expect($('#control :checkbox')).toExist()
      expect($('#control :checkbox')).not.toBeChecked()

    it "loads boolean true values from the model", ->
      template.form($('#dom'),
        attributes: 'type="xs:boolean" ref="prov:boolean"'
        model: '<prov:boolean>true</prov:boolean>'
        )
      expect($('#control :checkbox')).toBeChecked()

    it "loads boolean false values from the model", ->
      template.form($('#dom'),
        attributes: 'type="xs:boolean" ref="prov:boolean"'
        model: '<prov:boolean>false</prov:boolean>'
        )
      expect($('#control :checkbox')).not.toBeChecked()

    it "copes with non-boolean values in the model", ->
      template.form($('#dom'),
        attributes: 'type="xs:boolean" ref="prov:boolean"'
        model: '<prov:boolean>asdf</prov:boolean>'
        )
      expect($('#control :checkbox')).not.toBeChecked()

    it "updates its checkbox's checked state when the model updates", ->
      template.form($('#dom'), attributes: 'type="xs:boolean" ref="prov:reference"')
      expect($('#control :checkbox')).not.toBeChecked()
      $('#reference :input').val('true').change()
      expect($('#control :checkbox')).toBeChecked()
      $('#reference :input').val('false').change()
      expect($('#control :checkbox')).not.toBeChecked()

    it "updates the model based on its checked state", ->
      template.form($('#dom'), attributes: 'type="xs:boolean" ref="prov:reference"')
      checkbox = $('#control :input')

      expect($('#reference :input').val()).toBe('')

      # We're checking the box this way instead of using jQuery because
      # the way jQuery checks checkboxes changed after 1.6 and we support
      # earlier versions
      checkbox[0].checked = true
      checkbox.change()
      expect($('#reference :input').val()).toBe('true')

      checkbox[0].checked = false
      checkbox.change()
      expect($('#reference :input').val()).toBe('false')
