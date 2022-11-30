import { parseXml } from '../../../src/util/parseXml'
import { notRelevantXml, groupWithAbsoluteRelevantXpath } from '../../mocks/FormElement'
import { setRelevantAttribute } from '../../../src/util/setRelevantAttribute'
import { buildXPathResolverFn } from '../../../src/util/buildXPathResolverFn'

describe('setRelevantAttribute', () => {
  it('adds the irrelevant attribute to the element when the field is irrelevant', () => {
    const doc = parseXml(notRelevantXml)
    const modelResult = doc.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(setRelevantAttribute(model.firstElementChild, resolver, 'prov:textreference', false).outerHTML).to.eq('<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>false</prov:boolreference><prov:textreference irrelevant="true">test value</prov:textreference></prov:options>')
  })

  it('removes the irrelevant attribute from the element when the field is relevant', () => {
    const doc = parseXml(notRelevantXml)
    const modelResult = doc.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(setRelevantAttribute(model.firstElementChild, resolver, 'prov:textreference', true).outerHTML).to.eq('<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>false</prov:boolreference><prov:textreference>test value</prov:textreference></prov:options>')
  })

  it('adds the irrelevant attribute to an element when the xpath is absolute (/) and within a group', () => {
    const doc = parseXml(groupWithAbsoluteRelevantXpath)
    const modelResult = doc.evaluate('//*[local-name()="group2"]', doc)
    const group2Model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    expect(setRelevantAttribute(group2Model, resolver, '/prov:group1/prov:group2/prov:reference', false).outerHTML).to.eq('<prov:group2 xmlns:prov="http://www.example.com/orderoptions"><prov:reference irrelevant="true">test</prov:reference></prov:group2>')
  })

  it('adds the irrelevant attribute to an element when the xpath is absolute (//) and within a group', () => {
    const doc = parseXml(groupWithAbsoluteRelevantXpath)
    const modelResult = doc.evaluate('//*[local-name()="group2"]', doc)
    const group2Model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    expect(setRelevantAttribute(group2Model, resolver, '//prov:group1/prov:group2/prov:reference', false).outerHTML).to.eq('<prov:group2 xmlns:prov="http://www.example.com/orderoptions"><prov:reference irrelevant="true">test</prov:reference></prov:group2>')
  })
})
