describe '"secret" control', ->
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
        <secret id="control" label="Input" {{attributes}}>
          {{children}}
        </secret>
      </ui>
    </form>
  """)

  it "displays as an html password input element", ->
    template.form(dom)
    expect($('#control :input')).toBeMatchedBy('input[type=password]')

  sharedBehaviorForControls(template)
  sharedBehaviorForTypedControls(template)
