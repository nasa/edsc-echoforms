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
        <tree id="control" {{attributes}}>
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
            {{children}}
        </tree>
        {{ui}}
      </ui>
    </form>
  """)

  it "displays as an html div element", ->
    template.form(dom)
    expect($(':jstree')).toBeMatchedBy('div')

  sharedBehaviorForControls(template, skip_input_specs: true)

  attrs = 'ref="prov:treeReference" valueElementName="data_layer" separator="\/"'

  it "defaults to no selections", ->
    model = "<prov:treeReference></prov:treeReference>"

  it "reads selections from the model", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer>/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL</prov:data_layer>
      </prov:treeReference>
    """
    template.form(dom, model: model, attributes: attrs)
    expect($('.jstree-clicked').parent().attr('node_value')).toBe("/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL");

  it "will not allow irrelevant nodes to be selected", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer></prov:data_layer>
      </prov:treeReference>
    """
    children = """
      <item value="irrelevantNode" relevant="false()"/>
      <item value="relevantNode" relevant="true()"/>
    """

    form = template.form(dom, model: model, attributes: attrs, children: children)
    $(":jstree li[node_value = '/irrelevantNode'] > a ").each ->
      $(this).click()
    $(":jstree li[node_value = '/relevantNode'] > a ").each ->
      $(this).click()
    expect($('.jstree-clicked').parent().attr('node_value')).not.toMatch("irrelevantNode");
    expect($('.jstree-clicked').parent().attr('node_value')).toMatch("relevantNode");
    expect(form.echoforms('serialize')).not.toMatch(/irrelevantNode/)
    expect(form.echoforms('serialize')).toMatch(/relevantNode/)

  it "excludes from output any preselected nodes which are not relevant", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer>/irrelevantNode</prov:data_layer>
      </prov:treeReference>
    """
    children = """
      <item value="irrelevantNode" relevant="false()"/>
    """

    template.form(dom, model: model, attributes: attrs, children: children)
    expect($('.jstree-clicked').parent().attr('node_value')).not.toMatch("/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL");
    expect($('.jstree-clicked').parent().attr('node_value')).not.toMatch("irrelevantNode");

  it "automatically selects required nodes", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer></prov:data_layer>
      </prov:treeReference>
    """
    children = """
      <item value="requiredNode" required="true()"/>
    """

    template.form(dom, model: model, attributes: attrs, children: children)
    expect($('.jstree-clicked').parent().attr('node_value')).toMatch("requiredNode");

  it "relevancy takes precedence over required", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer></prov:data_layer>
      </prov:treeReference>
    """
    children = """
      <item value="requiredIrrelevantNode" required="true()" relevant="false()"/>
    """

    form = template.form(dom, model: model, attributes: attrs, children: children)
    expect(form.echoforms('serialize')).not.toMatch(/requiredIrrelevantNode/)

  it "updates the model when selections change", ->
    model = "<prov:treeReference></prov:treeReference>"
    template.form(dom, model: model, attributes: attrs)
    $(':jstree').jstree('open_all')
    $(":jstree li[node_value='/GLAH01/Data_40HZ_VAL'] > a ").each ->
      $(this).click()
    expect($('.jstree-clicked').parent().attr('node_value')).toBe("/GLAH01/Data_40HZ_VAL");

  it "includes nodes in output which are selected but hidden", ->
    model = "<prov:treeReference></prov:treeReference>"
    form = template.form(dom, model: model, attributes: attrs)
    $(':jstree').jstree('open_all')
    $(":jstree li[node_value='/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL_2'] > a ").each ->
      $(this).click()
    $(':jstree').jstree('close_all')
    expect(form.echoforms('serialize')).toMatch(/\/GLAH01\/Data_1HZ_VAL\/Engineering\/d_T_detID_VAL_2/)

  describe "label property", ->
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
      expect($(':jstree li[node_value="/value_with_label"]').text()).toEqual('a label')
      expect($(':jstree li[node_value="/value_with_empty_label"]').text()).toEqual('value_with_empty_label')
      expect($(':jstree li[node_value="/value_with_no_label"]').text()).toEqual('value_with_no_label')
  describe "'separator' option", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer>/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL</prov:data_layer>
        <prov:data_layer>Engineering</prov:data_layer>
      </prov:treeReference>
    """
    it "should add the provided value to the model if no separator specified", ->
      attrs = 'ref="prov:treeReference" valueElementName="data_layer" cascade="false"'
      form = template.form(dom, model: model, attributes: attrs)
      expect($('.jstree-clicked').size()).toEqual(1)
      expect(form.echoforms('serialize')).toMatch(/>Engineering</)
      $(':jstree').jstree('open_all')
      $(":jstree li[node_value='Data_40HZ_VAL'] > a ").each ->
        $(this).click()
      expect($('.jstree-clicked').size()).toEqual(2)
      expect(form.echoforms('serialize')).toMatch(/>Data_40HZ_VAL</)
    it "should generate and add a path to the model if a separator is specified", ->
      attrs = 'ref="prov:treeReference" valueElementName="data_layer" separator="\/" cascade="false"'
      form = template.form(dom, model: model, attributes: attrs)
      expect($('.jstree-clicked').size()).toEqual(1)
      expect(form.echoforms('serialize')).toMatch(/>\/GLAH01\/Data_1HZ_VAL\/Engineering\/d_T_detID_VAL</)
      $(':jstree').jstree('open_all')
      $(":jstree li[node_value='/GLAH01/Data_40HZ_VAL'] > a ").each ->
        $(this).click()
      expect($('.jstree-clicked').size()).toEqual(2)
      expect(form.echoforms('serialize')).toMatch(/>\/GLAH01\/Data_40HZ_VAL</)

  describe "'cascade' option", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer>/GLAH01/Data_1HZ_VAL/Engineering</prov:data_layer>
      </prov:treeReference>
    """
    it "should select all child nodes of selected node when cascade = true", ->
      attrs = 'ref="prov:treeReference" valueElementName="data_layer" separator="\/" cascade="true"'
      form = template.form(dom, model: model, attributes: attrs)
      $(':jstree').jstree('open_all')
      expect($('.jstree-clicked').size()).toEqual(3)
      $(":jstree li[node_value='/GLAH01/Data_1HZ_VAL'] > a ").each ->
        $(this).click()
      expect($('.jstree-clicked').size()).toEqual(5)

    it "should select only selected node when cascade = false", ->
      attrs = 'ref="prov:treeReference" valueElementName="data_layer" separator="\/" cascade="false"'
      form = template.form(dom, model: model, attributes: attrs)
      $(':jstree').jstree('open_all')
      expect($('.jstree-clicked').size()).toEqual(1)
      $(":jstree li[node_value='/GLAH01/Data_1HZ_VAL'] > a ").each ->
        $(this).click()
      expect($('.jstree-clicked').size()).toEqual(2)


  describe "other test cases", ->
    model = """
        <prov:treeReference type="tree">
        </prov:treeReference>
        <prov:treeReference2 type="tree">
        </prov:treeReference2>
      """
    it "handles multiple identical trees", ->
      #this is necessary to make sure multiple identical forms in the same DOM will not have id collisions
      attrs = 'valueElementName="data_layer" separator="\/"'
      ui = """
          <tree id="duplicate_test" #{attrs} ref='prov:treeReference'>
            <item value="value_with_label" label="a label"/>
            <item value="value_with_empty_label" label = ""/>
            <item value="value_with_no_label"/>
          </tree>
          <tree id="duplicate_test" #{attrs} ref='prov:treeReference2'>
            <item value="value_with_label" label="a label"/>
            <item value="value_with_empty_label" label = ""/>
            <item value="value_with_no_label"/>
          </tree>
        """
      form = template.form(dom, model: model, attributes: attrs, ui: ui)
      expect($(':jstree').size()).toEqual(3)
      expect($(':jstree').filter ->
        /duplicate_test/.test(this.id)
      .size()).toEqual(2)
      $($(":jstree")[1]).find("li[node_value='/value_with_label'] > a").each ->
        $(this).click()
      $($(":jstree")[2]).find("li[node_value='/value_with_no_label'] > a").each ->
        $(this).click()
      expect($('.jstree-clicked').size()).toEqual(2)
      expect($($('.jstree-clicked')[0]).parent().attr('node_value')).toBe("/value_with_label");
      expect($($('.jstree-clicked')[1]).parent().attr('node_value')).toBe("/value_with_no_label");
      expect(form.echoforms('serialize')).toMatch(/value_with_label/)
      expect(form.echoforms('serialize')).toMatch(/value_with_no_label/)



