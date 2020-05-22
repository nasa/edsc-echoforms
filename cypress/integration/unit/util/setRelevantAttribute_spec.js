import { parseXml } from '../../../../src/util/parseXml'
import { notRelevantXml } from '../../../mocks/FormElement'
import { setRelevantAttribute } from '../../../../src/util/setRelevantAttribute'
import { buildXPathResolverFn } from '../../../../src/util/buildXPathResolverFn'

describe('setRelevantAttribute', () => {
  it('adds the irrelevant attribute to the element when the field is irrelevant', () => {
    const doc = parseXml(notRelevantXml)
    const modelResult = doc.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    expect(setRelevantAttribute(model, resolver, 'prov:textreference', false).outerHTML).to.eq('<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>false</prov:boolreference><prov:textreference irrelevant="true">test value</prov:textreference></prov:options>')
  })

  it('removes the irrelevant attribute from the element when the field is relevant', () => {
    const doc = parseXml(notRelevantXml)
    const modelResult = doc.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    expect(setRelevantAttribute(model, resolver, 'prov:textreference', true).outerHTML).to.eq('<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>false</prov:boolreference><prov:textreference>test value</prov:textreference></prov:options>')
  })
})
