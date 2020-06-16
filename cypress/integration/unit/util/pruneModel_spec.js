import { parseXml } from '../../../../src/util/parseXml'
import { notRelevantXml } from '../../../mocks/FormElement'
import { pruneModel } from '../../../../src/util/pruneModel'
import { setRelevantAttribute } from '../../../../src/util/setRelevantAttribute'
import { buildXPathResolverFn } from '../../../../src/util/buildXPathResolverFn'

describe('pruneModel', () => {
  it('removes elements from the model that have the irrelevant attribute', () => {
    const doc = parseXml(notRelevantXml)
    const modelResult = doc.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(pruneModel(setRelevantAttribute(model.firstElementChild.cloneNode(true), resolver, 'prov:textreference', false)).outerHTML).to.eq('<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>false</prov:boolreference></prov:options>')
  })
})
