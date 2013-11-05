describe '"textarea" control', ->
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
        <textarea id="control" label="Input" {{attributes}}>
          {{children}}
        </textarea>
      </ui>
    </form>
  """)

  it "displays as an html textarea element", ->
    template.form(dom)
    expect($('#control :input')).toBeMatchedBy('textarea')

  sharedBehaviorForControls(template)
  sharedBehaviorForTypedControls(template)
