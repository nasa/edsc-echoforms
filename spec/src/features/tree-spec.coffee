describe '"tree" control', ->
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
        <tree id="subset_datalayer_tree" label="Choose datasets" ref="prov:SUBSET_DATA_LAYERS" required="false()" type="xsd:string" valueElementName="data_layer" separator="/">
            <item value="GLAH01">
                <item label="Data_1HZ" value="Data_1HZ_VAL">
                    <help> help text </help>
                    <item label="Parameter: DS_UTCTime_1" value="DS_UTCTime_1"/>
                    <item label="Engineering" value="Engineering">
                        <item label="Parameter: d_T_detID" value="d_T_detID_VAL"/>
                        <item label="Parameter: d_T_detID" value="d_T_detID_VAL_2"/>
                    </item>
                </item>
                <item label="Data_40HZ" value="Data_40HZ_VAL"/>
            </item>
            <item value="GLAH02"/>
        </tree>
        {{ui}}
      </ui>
    </form>
  """)

  it "displays as an html div element", ->
    template.form(dom)
    expect($(':jstree')).toBeMatchedBy('div')

  #sharedBehaviorForControls(template)

  attrs = 'ref="prov:treeReference" valueElementName="data_layer"'

  it "defaults to no selections", ->
    model = "<prov:treeReference></prov:treeReference>"

  it "reads selections from the model", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer>/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL</prov:data_layer>
      </prov:treeReference>
    """
    template.form(dom, model: model, attributes: attrs)
    expect($('#control').find("prov\\:treeReference[type='tree'] >> prov\\:data_layer")[0].text()).toBe("/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL");


  it "updates the model when selections change", ->
    model = "<prov:treeReference></prov:treeReference>"
    template.form(dom, model: model, attributes: attrs)
    $(":jstree li[node_value='/GLAH01/Data_40HZ_VAL'] > a ").each ->
      $(this).click()
    expect($('#control').find("prov\\:treeReference[type='tree'] >> prov\\:data_layer")[0].text()).toBe("/GLAH01/Data_40HZ_VAL");

  it "properly populates the label property when not provided", ->
    model = "<prov:treeReference></prov:treeReference>"
    ui = """
        <tree id="referenceSelect" #{attrs}>
          <item value="value_with_label" label="a label"/>
          <item value="value_with_empty_label" label = ""/>
          <item value="value_with_no_label"/>
        </tree>
      """
    template.form(dom, model: model, attributes: attrs, ui: ui)
    expect($('#referenceSelect li[node_value="value_with_label"]').text()).toEqual('a label')
    expect($('#referenceSelect li[node_value="value_with_empty_label"]').text()).toEqual('value_with_empty_label')
    expect($('#referenceSelect li[node_value="value_with_no_label"]').text()).toEqual('value_with_no_label')

    #need to also test separator and cascade functionality
