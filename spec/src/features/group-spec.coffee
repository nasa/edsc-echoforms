describe '"group" control', ->
  template = new FormTemplate("""
    <form xmlns="http://echo.nasa.gov/v9/echoforms"
          xmlns:xs="http://www.w3.org/2001/XMLSchema"
          targetNamespace="http://www.example.com/echoforms">
      <model>
        <instance>
          <prov:options xmlns:prov="http://www.example.com/orderoptions">
            <prov:reference/>
            <prov:parentReference>
              <prov:childReference>{{childValue}}</prov:childReference>
            </prov:parentReference>
            {{model}}
          </prov:options>
        </instance>
      </model>
      <ui>
        <input id="reference" label="Reference value" ref="prov:reference" type="xs:string"/>
        <input id="childReference" label="Reference value" ref="prov:parentReference/prov:childReference" type="xs:string"/>
        <group id="control" ref="prov:parentReference" {{attributes}}>
          <input id="child" ref="prov:childReference" {{childAttributes}}>
            {{grandchildren}}
          </input>
          {{children}}
        </group>
      </ui>
    </form>
  """)

  sharedBehaviorForControls(template, skip_input_specs: true)
  sharedBehaviorForGroupingControls(template)
