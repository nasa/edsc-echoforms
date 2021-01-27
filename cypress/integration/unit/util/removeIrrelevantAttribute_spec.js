import { parseXml } from '../../../../src/util/parseXml'
import { notRelevantXml } from '../../../mocks/FormElement'
import { removeIrrelevantAttribute } from '../../../../src/util/removeIrrelevantAttribute'
import { setRelevantAttribute } from '../../../../src/util/setRelevantAttribute'
import { buildXPathResolverFn } from '../../../../src/util/buildXPathResolverFn'

describe('removeIrrelevantAttribute', () => {
  it('removes the irrelevant attributes from the model', () => {
    const doc = parseXml(notRelevantXml)
    const modelResult = doc.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(removeIrrelevantAttribute(setRelevantAttribute(model.firstElementChild.cloneNode(true), resolver, 'prov:textreference', false)).outerHTML).to.eq('<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>false</prov:boolreference><prov:textreference>test value</prov:textreference></prov:options>')
  })
})
