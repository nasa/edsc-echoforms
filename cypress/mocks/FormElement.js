export const checkboxXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>true</prov:boolreference></prov:options></instance></model><ui><input id="boolinput" label="Bool input" a="a" ref="prov:boolreference" type="xs:boolean"><help>Helpful text</help></input></ui></form>'

export const textfieldXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="textinput" label="Text input" a="a" ref="prov:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'

export const secretXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><secret id="secret" label="Secret" a="a" ref="prov:textreference"></secret></ui></form>'

export const textareaXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><textarea id="textinput" label="Textarea input" a="a" ref="prov:textreference" type="xs:string"><help>Helpful text</help></textarea></ui></form>'

export const outputXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><output id="output" label="Output" a="a" ref="prov:textreference"></output></ui></form>'

export const urlOutputXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><output type="xs:anyURI" id="output" label="URL Output" a="a" ref="prov:textreference"></output></ui></form>'

export const notRelevantXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>false</prov:boolreference><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="boolinput" label="Bool input" a="a" ref="prov:boolreference" type="xs:boolean"></input><input id="textinput" label="Relevant based on checkbox" a="a" ref="prov:textreference" relevant="prov:boolreference=\'true\'" type="xs:string"></input></ui></form>'

export const readOnlyXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>true</prov:boolreference><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="boolinput" label="Bool input" a="a" ref="prov:boolreference" type="xs:boolean"></input><input id="textinput" label="Relevant based on checkbox" a="a" ref="prov:textreference" readonly="prov:boolreference=\'true\'" type="xs:string"></input></ui></form>'

export const selectXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:selectreference><prov:value>value 1</prov:value><prov:value>value 2</prov:value></prov:selectreference></prov:options></instance></model><ui><select id="selectinput" label="Select input" a="a" ref="prov:selectreference" valueElementName="value"><help>Helpful text</help></select></ui></form>'

export const multiSelectXml = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:selectreference><prov:value>value 1</prov:value><prov:value>value 2</prov:value></prov:selectreference></prov:options></instance></model><ui><select multiple="true" id="selectinput" label="Select input" a="a" ref="prov:selectreference" valueElementName="value"><help>Helpful text</help></select></ui></form>'
