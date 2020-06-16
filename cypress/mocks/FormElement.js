export const checkboxXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>true</prov:boolreference></prov:options></instance></model><ui><input id="boolinput" label="Bool input" ref="prov:boolreference" type="xs:boolean"><help>Helpful text</help></input></ui></form>'

export const shapeFileCheckboxXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:shapefileReference>true</prov:shapefileReference></prov:options></instance></model><ui><input id="test-use-shapefile" label="Use Shapefile" ref="prov:shapefileReference" type="xs:boolean" /></ui></form>'

export const textfieldXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'

export const textFieldWithXpathConstraintXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test</prov:textreference></prov:options></instance></model><ui><input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help><constraints><constraint><xpath>prov:textreference="test value"</xpath><alert>Value must be "test value"</alert></constraint></constraints></input></ui></form>'

export const textFieldWithPatternConstraintXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help><constraints><constraint><pattern>^test value$</pattern><alert>Value must be "test value"</alert></constraint></constraints></input></ui></form>'

export const secretXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><secret id="secret" label="Secret" ref="prov:textreference"></secret></ui></form>'

export const textareaXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><textarea id="textinput" label="Textarea input" ref="prov:textreference" type="xs:string"><help>Helpful text</help></textarea></ui></form>'

export const outputXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><output id="output" label="Output" ref="prov:textreference"><help>Helpful text</help></output></ui></form>'

export const urlOutputXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><output type="xs:anyURI" id="output" label="URL Output" ref="prov:textreference"></output></ui></form>'

export const notRelevantXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>false</prov:boolreference><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="boolinput" label="Bool input" ref="prov:boolreference" type="xs:boolean"></input><input id="textinput" label="Relevant based on checkbox" ref="prov:textreference" relevant="prov:boolreference=\'true\'" type="xs:string"></input></ui></form>'

export const readOnlyXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>true</prov:boolreference><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="boolinput" label="Bool input" ref="prov:boolreference" type="xs:boolean"></input><input id="textinput" label="Relevant based on checkbox" ref="prov:textreference" readonly="prov:boolreference=\'true\'" type="xs:string"></input></ui></form>'

export const selectXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:selectreference><prov:value>test value 1</prov:value><prov:value>test value 2</prov:value></prov:selectreference></prov:options></instance></model><ui><select id="selectinput" label="Select input" ref="prov:selectreference" valueElementName="value"><item label="test label 1" value="test value 1" /><item label="test label 2" value="test value 2" /><help>Helpful text</help></select></ui></form>'

export const multiSelectXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:selectreference><prov:value>value 1</prov:value><prov:value>value 2</prov:value></prov:selectreference></prov:options></instance></model><ui><select multiple="true" id="selectinput" label="Select input" ref="prov:selectreference" valueElementName="value"><help>Helpful text</help></select></ui></form>'

export const selectrefXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:selectrefReference><prov:value>test value 1</prov:value><prov:value>test value 2</prov:value></prov:selectrefReference></prov:options></instance></model><ui><selectref id="selectinput" label="Select input" ref="prov:selectrefReference"><item label="test label 1" value="test value 1" /><item label="test label 2" value="test value 2" /><help>Helpful text</help></selectref></ui></form>'

export const datetimeXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:datetimereference>2020-01-01T00:00:00</prov:datetimereference></prov:options></instance></model><ui><input id="datetimeinput" label="DateTime input" ref="prov:datetimereference" type="xs:datetime"><help>Helpful text</help></input></ui></form>'

export const rangeXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:rangeReference>5</prov:rangeReference></prov:options></instance></model><ui><range id="range" label="Range" start="1" end="10" step="1" type="xs:int" ref="prov:rangeReference"><help>Helpful text</help></range></ui></form>'

export const groupXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:groupreference><prov:textreference>test value</prov:textreference></prov:groupreference></prov:options></instance></model><ui><group id="group" label="Group" ref="prov:groupreference"><help>Helpful group text</help><input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help></input></group></ui></form>'

export const doubleXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:doubleReference>42</prov:doubleReference></prov:options></instance></model><ui><input id="double" label="Double input" ref="prov:doubleReference" type="xs:double"><help>Helpful text</help></input></ui></form>'

export const integerXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:integerReference>42</prov:integerReference></prov:options></instance></model><ui><input id="integer" label="Integer input" ref="prov:integerReference" type="xs:int"><help>Helpful text</help></input></ui></form>'

export const longXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:longReference>42</prov:longReference></prov:options></instance></model><ui><input id="long" label="Long input" ref="prov:longReference" type="xs:long"><help>Helpful text</help></input></ui></form>'

export const shortXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:shortReference>42</prov:shortReference></prov:options></instance></model><ui><input id="short" label="Short input" ref="prov:shortReference" type="xs:short"><help>Helpful text</help></input></ui></form>'

export const prepopulatedXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance><extension name="pre:prepopulate" xmlns:pre="http://echo.nasa.gov/v9/echoforms/prepopulate"><pre:expressions><pre:expression ref="prov:textreference" source="PREPOP" /></pre:expressions></extension></model><ui><input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'

export const treeXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:treeReference><prov:data_layer>/Parent1</prov:data_layer></prov:treeReference></prov:options></instance></model><ui><tree id="subset_datalayer_tree" label="Choose datasets" ref="prov:treeReference" required="false()" type="xsd:string" valueElementName="data_layer" separator="/" simplifyOutput="false" cascade="true"><item value="Parent1"><item label="Child 1" value="Child1" /></item></tree></ui></form>'

export const treeWithSimplifyOutputXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:treeReference><prov:data_layer>/Parent1</prov:data_layer></prov:treeReference></prov:options></instance></model><ui><tree id="subset_datalayer_tree" label="Choose datasets" ref="prov:treeReference" required="false()" type="xsd:string" valueElementName="data_layer" separator="/" simplifyOutput="true" cascade="true"><item value="Parent1"><item value="Child1-1"><item value="Child1-1-1"/><item value="Child1-1-2"/><item value="Child1-1-3"><item value="Child1-1-3-1"/><item value="Child1-1-3-2"/></item></item><item value="Child1-2"><item value="Child1-2-1"/><item value="Child1-2-2"/></item><item value="Child1-3"><item value="Child1-3-1"/><item value="Child1-3-2"/></item></item></tree></ui></form>'

export const treeWithIndeterminateXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:treeReference><prov:data_layer>/Parent1/Child2</prov:data_layer></prov:treeReference></prov:options></instance></model><ui><tree id="subset_datalayer_tree" label="Choose datasets" ref="prov:treeReference" required="false()" type="xsd:string" valueElementName="data_layer" separator="/" simplifyOutput="false" cascade="true"><item value="Parent1"><item label="Child 1" value="Child1" /><item label="Child 2" value="Child2" /></item></tree></ui></form>'

export const treeWithRequiredXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:treeReference></prov:treeReference></prov:options></instance></model><ui><tree id="subset_datalayer_tree" label="Choose datasets" ref="prov:treeReference" required="false()" type="xsd:string" valueElementName="data_layer" separator="/" simplifyOutput="false" cascade="true"><item value="Parent1"><item label="Child 1" value="Child1" required="true" /></item></tree></ui></form>'

export const treeWithIrrelevantXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:treeReference></prov:treeReference></prov:options></instance></model><ui><tree id="subset_datalayer_tree" label="Choose datasets" ref="prov:treeReference" required="false()" type="xsd:string" valueElementName="data_layer" separator="/" simplifyOutput="false" cascade="true"><item value="Parent1"><item label="Child 1" value="Child1" relevant="false" /></item></tree></ui></form>'

export const treeWithMaxParametersXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:treeReference><prov:data_layer>/Parent1</prov:data_layer><prov:data_layer>/Parent1/Child1-1</prov:data_layer><prov:data_layer>/Parent1/Child1-2</prov:data_layer><prov:data_layer>/Parent1/Child1-2/Child1-2-1</prov:data_layer><prov:data_layer>/Parent1/Child1-2/Child1-2-2</prov:data_layer><prov:data_layer>/Parent1/Child1-3</prov:data_layer><prov:data_layer>/Parent1/Child1-3/Child1-3-1</prov:data_layer><prov:data_layer>/Parent1/Child1-3/Child1-3-2</prov:data_layer></prov:treeReference></prov:options></instance></model><ui><tree id="subset_datalayer_tree" label="Choose datasets" ref="prov:treeReference" required="false()" type="xsd:string" valueElementName="data_layer" separator="/" simplifyOutput="false" cascade="true" maxParameters="4"><item value="Parent1"><item value="Child1-1" /><item value="Child1-2"><item value="Child1-2-1"/><item value="Child1-2-2"/></item><item value="Child1-3"><item value="Child1-3-1"/><item value="Child1-3-2"/></item></item></tree></ui></form>'

export const groupWithAbsoluteRelevantXpath = '<form xmlns="http://echo.nasa.gov/v9/echoforms" xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="http://www.example.com/echoforms"><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:group1><prov:group2><prov:reference>test</prov:reference></prov:group2></prov:group1></prov:options></instance></model><ui><group id="group1" label="Group 1" ref="prov:group1" attrs="attrs"><group id="group2" label="Group 2" ref="prov:group2" attrs="attrs"><input id="reference" label="Reference value" ref="//prov:group1/prov:group2/prov:reference" type="xs:string" relevant="false()"/></group></group></ui></form>'
