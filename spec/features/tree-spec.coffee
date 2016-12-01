describe '"tree" control', ->
  # Selects with open="true" are not currently implemented, since they are unused in ops

  template = new FormTemplate("""
    <form xmlns="http://echo.nasa.gov/v9/echoforms"
          xmlns:xs="http://www.w3.org/2001/XMLSchema"
          targetNamespace="http://www.example.com/echoforms">
      <model>
        <instance>
          <prov:options xmlns:prov="http://www.example.com/orderoptions">
            <prov:reference>foo</prov:reference>
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
    template.form($('#dom'))
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
    template.form($('#dom'), model: model, attributes: attrs)
    $(':jstree').jstree('open_all')
    expect($('.jstree-clicked').parent().attr('node_value')).toBe("/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL");

  describe "'irrelevant' nodes", ->
    beforeEach ->
      model = """
        <prov:treeReference type="tree">
          <prov:data_layer></prov:data_layer>
        </prov:treeReference>
      """
      children = """
        <item value="irrelevantNode" relevant="false()"/>
        <item value="relevantNode" relevant="true()"/>
      """
      @form = template.form($('#dom'), model: model, attributes: attrs, children: children)

    it "does not allow irrelevant nodes to be selected", ->
      $(":jstree li[node_value = '/irrelevantNode'] > a ").each ->
        $(this).click()
      $(":jstree li[node_value = '/relevantNode'] > a ").each ->
        $(this).click()
      expect(@form.echoforms('serialize')).not.toMatch(/irrelevantNode/)
      expect(@form.echoforms('serialize')).toMatch(/relevantNode/)

    it "displays a '[not available]' message", ->
      expect($(":jstree li[node_value = '/irrelevantNode'] span.echoforms-help ").text()).toMatch("[not available]")

    it "removes the checkbox", ->
      expect($(":jstree li[node_value = '/irrelevantNode'] i.jstree-icon")).not.toHaveClass("jstree-checkbox")

    it "adds a check mark icon", ->
      expect($(":jstree li[node_value = '/irrelevantNode'] i.jstree-icon")).toHaveClass("jstree-disabled-icon")

    it "sets the item-relevant attribute to false", ->
      expect($(":jstree li[node_value = '/irrelevantNode']")).toHaveAttr("item-relevant","false")

  it "excludes from output any preselected nodes which are not relevant", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer>/irrelevantNode</prov:data_layer>
      </prov:treeReference>
    """
    children = """
      <item value="irrelevantNode" relevant="false()"/>
    """

    form = template.form($('#dom'), model: model, attributes: attrs, children: children)
    expect(form.echoforms('serialize')).not.toMatch(/irrelevantNode/)

  describe "'required' nodes", ->
    beforeEach ->
      model = """
        <prov:treeReference type="tree">
          <prov:data_layer></prov:data_layer>
        </prov:treeReference>
      """
      children = """
        <item value="requiredNode" required="true()"/>
      """
      @form = template.form($('#dom'), model: model, attributes: attrs, children: children)

    it "preselects required nodes", ->
      expect($('.jstree-clicked').parent().attr('node_value')).toMatch("requiredNode");
      expect(@form.echoforms('serialize')).toMatch(/requiredNode/)

    it "includes required nodes in output even if they are not selected", ->
      $(":jstree li[node_value = '/requiredNode'] > a ").click()
      expect($('.jstree-clicked').parent().attr('node_value')).not.toMatch("requiredNode");
      expect(@form.echoforms('serialize')).toMatch(/requiredNode/)

    it "displays a '[required]' message", ->
      expect($(":jstree li[node_value = '/requiredNode'] span.echoforms-help ").text()).toMatch("[required]")

    it "removes the checkbox", ->
      expect($(":jstree li[node_value = '/requiredNode'] i.jstree-icon")).not.toHaveClass("jstree-checkbox")

    it "adds an 'X' icon", ->
      expect($(":jstree li[node_value = '/requiredNode'] i.jstree-icon")).toHaveClass("jstree-required-icon")

    it "sets the item-required attribute to true", ->
      expect($(":jstree li[node_value = '/requiredNode']")).toHaveAttr("item-required","true")

  it "handles dynamicly required nodes", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer></prov:data_layer>
      </prov:treeReference>
    """
    children = """
      <item value="dynamicNode" required="contains('required',//prov:reference)"/>
    """

    form = template.form($('#dom'), model: model, attributes: attrs, children: children)
    expect($('.jstree-clicked').parent().attr('node_value')).not.toMatch("dynamicNode");
    expect(form.echoforms('serialize')).not.toMatch(/dynamicNode/)
    $('.echoforms-element-text').val('required').click()
    expect(form.echoforms('serialize')).toMatch(/dynamicNode/)
    $('.echoforms-element-text').val('bar').click()
    expect(form.echoforms('serialize')).not.toMatch(/dynamicNode/)

  describe "dynamically relevant nodes", ->
    beforeEach ->
      model = """
        <prov:treeReference type="tree">
          <prov:data_layer></prov:data_layer>
        </prov:treeReference>
      """
      children = """
        <item value="dynamicNode" relevant="contains('relevant',//prov:reference)"/>
      """
      @form = template.form($('#dom'), model: model, attributes: attrs, children: children)

    it "allows selecting nodes when relevant and blocks when not relevant", ->
      $(":jstree li[node_value = '/dynamicNode'] > a ").click()
      expect(@form.echoforms('serialize')).not.toMatch(/dynamicNode/)
      $('.echoforms-element-text').val('relevant').click()
      expect(@form.echoforms('serialize')).toMatch(/dynamicNode/)
      $('.echoforms-element-text').val('bar').click()
      expect(@form.echoforms('serialize')).not.toMatch(/dynamicNode/)

    it "automatically selects newly enabled nodes", ->
      $(":jstree li[node_value = '/dynamicNode'] > a ").click()
      expect(@form.echoforms('serialize')).not.toMatch(/dynamicNode/)
      $('.echoforms-element-text').val('relevant').click()
      expect(@form.echoforms('serialize')).toMatch(/dynamicNode/)

  it "removes from output any irrelevant but required nodes", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer></prov:data_layer>
      </prov:treeReference>
    """
    children = """
      <item value="requiredIrrelevantNode" required="true()" relevant="false()"/>
    """

    form = template.form($('#dom'), model: model, attributes: attrs, children: children)
    expect(form.echoforms('serialize')).not.toMatch(/requiredIrrelevantNode/)

  it "updates the model when selections change", ->
    model = "<prov:treeReference></prov:treeReference>"
    template.form($('#dom'), model: model, attributes: attrs)
    $(':jstree').jstree('open_all')
    $(":jstree li[node_value='/GLAH01/Data_40HZ_VAL'] > a ").each ->
      $(this).click()
    expect($('.jstree-clicked').parent().attr('node_value')).toBe("/GLAH01/Data_40HZ_VAL");

  it "does not allow nodes to be collapsed", ->
    model = "<prov:treeReference></prov:treeReference>"
    form = template.form($('#dom'), model: model, attributes: attrs)
    $(':jstree').jstree('open_all')
    $(":jstree li[node_value='/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL_2'] > a ").click()
    $(":jstree li[node_value='/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL_2'] > i.jstree-ocl ").click()
    expect($(":jstree li[node_value='/GLAH01/Data_1HZ_VAL/Engineering/d_T_detID_VAL_2'] > a ")).toHaveClass('jstree-clicked')
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
      template.form($('#dom'), model: model, attributes: attrs, ui: ui)
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
    it "adds the provided value to the model if no separator specified", ->
      attrs = 'ref="prov:treeReference" valueElementName="data_layer" cascade="false" simplify_output="false"'
      form = template.form($('#dom'), model: model, attributes: attrs)
      $(':jstree').jstree('open_all')
      expect($('.jstree-clicked').size()).toEqual(1)
      expect(form.echoforms('serialize')).toMatch(/>Engineering</)
      $(':jstree').jstree('open_all')
      $(":jstree li[node_value='Data_40HZ_VAL'] > a ").each ->
        $(this).click()
      expect($('.jstree-clicked').size()).toEqual(2)
      expect(form.echoforms('serialize')).toMatch(/>Data_40HZ_VAL</)
    it "generates and adds a path to the model if a separator is specified", ->
      attrs = 'ref="prov:treeReference" valueElementName="data_layer" separator="\/" cascade="false"'
      form = template.form($('#dom'), model: model, attributes: attrs)
      $(':jstree').jstree('open_all')
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
    it "selects all child nodes of selected node when cascade = true", ->
      attrs = 'ref="prov:treeReference" valueElementName="data_layer" separator="\/" cascade="true"'
      form = template.form($('#dom'), model: model, attributes: attrs)
      $(':jstree').jstree('open_all')
      expect($('.jstree-clicked').size()).toEqual(3)
      $(":jstree li[node_value='/GLAH01/Data_1HZ_VAL'] > a ").each ->
        $(this).click()
      expect($('.jstree-clicked').size()).toEqual(5)

    it "selects only selected node when cascade = false", ->
      attrs = 'ref="prov:treeReference" valueElementName="data_layer" separator="\/" cascade="false"'
      form = template.form($('#dom'), model: model, attributes: attrs)
      $(':jstree').jstree('open_all')
      expect($('.jstree-clicked').size()).toEqual(1)
      $(":jstree li[node_value='/GLAH01/Data_1HZ_VAL'] > a ").each ->
        $(this).click()
      expect($('.jstree-clicked').size()).toEqual(2)

  describe "simplify_output option", ->
    model = """
      <prov:treeReference type="tree">
        <prov:data_layer></prov:data_layer>
      </prov:treeReference>
    """
    ui = """
          <tree id="tree_to_simplify" ref="prov:treeReference" valueElementName="data_layer" cascade="true">
            <item value="top_node_1">
              <item value="level_1_child_1">
                <item value="level_2_child_1">
                  <item value="level_3_child_1"></item>
                  <item value="level_3_child_2"></item>
                </item>
                <item value="level_2_child_2">
                  <item value="level_3_child_3"></item>
                  <item value="level_3_child_4"></item>
                </item>
              </item>
            </item>
            <item value="top_node_2">
              <item value="level_1_child_2">
                <item value="level_2_child_3">
                  <item value="relevant_child" relevant="true"></item>
                  <item value="irrelevant_child" relevant="false"></item>
                </item>
                <item value="level_2_child_4">
                  <item value="required_child" required="true"></item>
                  <item value="not_required_child" required="false"></item>
                </item>
              </item>
            </item>
          </tree>
        """
    it "includes all selected and implied nodes when set to false", ->
      no_simplify_ui = ui.replace('cascade="true"', 'cascade="true" simplify_output="false"')
      form = template.form($('#dom'), ui: no_simplify_ui, model: model, attrs: attrs)
      $(':jstree').jstree('open_all')

      $(":jstree li[node_value='level_2_child_1'] > a ").click()
      expect(form.echoforms('serialize')).not.toMatch(/>top_node_1</)
      expect(form.echoforms('serialize')).not.toMatch(/>level_1_child_1</)
      expect(form.echoforms('serialize')).toMatch(/>level_2_child_1</)
      expect(form.echoforms('serialize')).toMatch(/>level_3_child_1</)
      expect(form.echoforms('serialize')).toMatch(/>level_3_child_2</)
      expect(form.echoforms('serialize')).not.toMatch(/>level_2_child_2</)

    describe "defaults to true", ->
      beforeEach ->
        @form = template.form($('#dom'), ui: ui, model: model)
        $(':jstree').jstree('open_all')
        $(":jstree li[node_value='level_2_child_1'] > a ").click()

      describe "when a parent node is selected", ->
        it "includes only that node, and not parents or children in the form output", ->
          expect(@form.echoforms('serialize')).not.toMatch(/top_node_1/)
          expect(@form.echoforms('serialize')).not.toMatch(/level_1_child_1/)
          expect(@form.echoforms('serialize')).toMatch(/level_2_child_1/)
          expect(@form.echoforms('serialize')).not.toMatch(/level_3/)
          expect(@form.echoforms('serialize')).not.toMatch(/level_2_child_2/)

    describe "simplifies tree selections", ->
      describe "when an entire subtree is selected", ->
        beforeEach ->
          @form = template.form($('#dom'), ui:ui, model: model)
          $(':jstree').jstree('open_all')
          $(":jstree li[node_value='level_2_child_1'] > a ").click()

        describe "when a parent node is explicitely clicked", ->

          it "includes the parent node in the form output", ->
            expect(@form.echoforms('serialize')).toMatch(/level_2_child_1/)

          it "does not include any node above the parent node in form output", ->
            expect(@form.echoforms('serialize')).not.toMatch(/top_node_1/)
            expect(@form.echoforms('serialize')).not.toMatch(/level_1_child_1/)

          it "omits leaf nodes under the parent node", ->
            expect(@form.echoforms('serialize')).not.toMatch(/level_3_/)
            expect(@form.echoforms('serialize')).not.toMatch(/level_2_child_2/)

        describe "when selecting all subtrees causes its ancestor nodes to be full subtrees", ->
          beforeEach ->
            $(":jstree li[node_value='level_2_child_2'] > a ").click()

          it "includes the top node of the fully selected subtree in the form output", ->
            expect(@form.echoforms('serialize')).toMatch(/top_node_1/)

          it "omits any intermediate ancestors from the form output", ->
            expect(@form.echoforms('serialize')).not.toMatch(/level_1_child/)

      describe "when only leaf nodes are selected", ->
        beforeEach ->
          @form = template.form($('#dom'), ui:ui, model: model)
          $(':jstree').jstree('open_all')
          $(":jstree li[node_value='level_3_child_1'] > a ").click()
          $(":jstree li[node_value='level_3_child_3'] > a ").click()

        it "includes the leaf nodes in the form output", ->
          expect(@form.echoforms('serialize')).toMatch(/level_3_child_1/)
          expect(@form.echoforms('serialize')).toMatch(/level_3_child_3/)

        it "omits the parent nodes from the form output", ->
          expect(@form.echoforms('serialize')).not.toMatch(/level_1_child.*/)
          expect(@form.echoforms('serialize')).not.toMatch(/level_2_child.*/)


    describe "when a subtree contains required nodes", ->
      beforeEach ->
        @form = template.form($('#dom'), ui:ui, model: model)
        $(':jstree').jstree('open_all')

      it "includes the required node in the form output", ->
        expect(@form.echoforms('serialize')).toMatch(/required_child.*/)

      it "does not include the parent node in the form output", ->
        expect(@form.echoforms('serialize')).not.toMatch(/level_2_child_4</)

      describe "when all non required siblings are selected", ->
        beforeEach ->
          $(":jstree li[node_value='not_required_child'] > a ").click()

        it "includes the parent node in the form output", ->
          expect(@form.echoforms('serialize')).toMatch(/level_2_child_4</)

        it "omits the required node from the form output", ->
          expect(@form.echoforms('serialize')).not.toMatch(/required_child/)

    describe "when a subtree contains irrelevant nodes", ->
      describe "when all relevant child nodes are selected", ->
        beforeEach ->
          @form = template.form($('#dom'), ui:ui, model: model)
          $(':jstree').jstree('open_all')
          $(":jstree li[node_value='relevant_child'] > a ").click()

        it "renders the parent node as clicked", ->
          expect($(":jstree li[node_value='relevant_child'] > a")).toHaveClass("jstree-clicked")

        it "omits the parent node from the form ouput", ->
          expect(@form.echoforms('serialize')).not.toMatch(/level_2_child_3/)

        it "includes the selected child node in the form output", ->
          expect(@form.echoforms('serialize')).toMatch(/>relevant_child/)

      describe "when a parent node containing irrelevant nodes is clicked", ->
        beforeEach ->
          @form = template.form($('#dom'), ui:ui, model: model)
          $(':jstree').jstree('open_all')
          $(":jstree li[node_value='level_2_child_3'] > a ").click()

        it "renders the parent node as clicked", ->
          expect($(":jstree li[node_value='level_2_child_3'] > a")).toHaveClass("jstree-clicked")

        it "omits the parent node from the form ouput", ->
          expect(@form.echoforms('serialize')).not.toMatch(/level_2_child_3/)

        it "includes all relevant child nodes in the form output", ->
          expect(@form.echoforms('serialize')).toMatch(/>relevant_child/)

      describe "when a parent node containing irrelevant descendants is clicked", ->
        beforeEach ->
          @form = template.form($('#dom'), ui:ui, model: model)
          $(':jstree').jstree('open_all')
          $(":jstree li[node_value='level_1_child_2'] > a ").click()

        it "renders the parent node as clicked", ->
          expect($(":jstree li[node_value='level_1_child_2'] > a")).toHaveClass("jstree-clicked")

        it "omits the parent node from the form ouput", ->
          expect(@form.echoforms('serialize')).not.toMatch(/level_1_child_2/)

        describe "includes all relevant descendant nodes in the form output", ->
          it "includes leaf descendants", ->
            expect(@form.echoforms('serialize')).toMatch(/>relevant_child/)

          it "includes any full subtrees", ->
            expect(@form.echoforms('serialize')).toMatch(/level_2_child_4/)

          it "does not include leaf nodes under full subtrees", ->
            expect(@form.echoforms('serialize')).not.toMatch(/.*required_child/)

      describe "when default values are specified in the model", ->
        beforeEach ->
          model = """
            <prov:treeReference type="tree">
              <prov:data_layer>top_node_1</prov:data_layer>
              <prov:data_layer>top_node_2</prov:data_layer>
            </prov:treeReference>
          """
          @form = template.form($('#dom'), ui:ui, model: model)

          #$(":jstree li[node_value='top_node_2'] > i.jstree-ocl").click()

        it "includes specified full subtrees in the form output", ->
          expect(@form.echoforms('serialize')).toMatch(/top_node_1/)

        it "omits specified subtrees with irrelevant nodes in the form output", ->
          expect(@form.echoforms('serialize')).not.toMatch(/top_node_2/)


  describe "other test cases", ->
    model = """
        <prov:treeReference type="tree">
        </prov:treeReference>
        <prov:treeReference2 type="tree">
        </prov:treeReference2>
      """
    describe "when 2 trees share the same id", ->
      #this is necessary to make sure multiple identical forms in the same DOM will not have id collisions
      beforeEach ->
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
        @form = template.form($('#dom'), model: model, attributes: attrs, ui: ui)

      it "should include 2 trees with the duplicate id in the DOM", ->
        expect($(':jstree').filter ->
          /duplicate_test/.test(this.id)
        .size()).toEqual(2)

      describe "when once node in each duplicate tree is clicked", ->
        beforeEach ->
          $($(":jstree")[1]).find("li[node_value='/value_with_label'] > a").each ->
            $(this).click()
          $($(":jstree")[2]).find("li[node_value='/value_with_no_label'] > a").each ->
            $(this).click()

        it "should include both selected nodes in the form output", ->
          expect($('.jstree-clicked').size()).toEqual(2)
          expect($($('.jstree-clicked')[0]).parent().attr('node_value')).toBe("/value_with_label");
          expect($($('.jstree-clicked')[1]).parent().attr('node_value')).toBe("/value_with_no_label");
          expect(@form.echoforms('serialize')).toMatch(/value_with_label/)
          expect(@form.echoforms('serialize')).toMatch(/value_with_no_label/)
