describe 'Input control', ->
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
        <input id="control" label="Input" {{attributes}}>
          {{children}}
        </input>
      </ui>
    </form>
  """)

  sharedBehaviorForControls(template)
  sharedBehaviorForTypedControls(template)

  describe '"relevant" attribute', ->


  describe '"required" attribute', ->

  describe '"readonly" attribute', ->

  describe 'validation', ->
    describe '"pattern" constraint', ->

    describe '"xpath" constraint', ->
