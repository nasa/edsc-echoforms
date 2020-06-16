import { getNodeValue } from '../../../../src/util/getNodeValue'
import { parseXml } from '../../../../src/util/parseXml'
import { selectXml, textareaXml } from '../../../mocks/FormElement'
import { buildXPathResolverFn } from '../../../../src/util/buildXPathResolverFn'

describe('getNodeValue', () => {
  it('returns the value from the model', () => {
    const ref = 'prov:textreference'
    const doc = parseXml(textareaXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    expect(getNodeValue(ref, model.firstElementChild, resolver)).to.eq('test value')
  })

  it('returns an array value from the model', () => {
    const ref = 'prov:selectreference'
    const doc = parseXml(selectXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    expect(getNodeValue(ref, model.firstElementChild, resolver)).to.eql([
      'test value 1',
      'test value 2'
    ])
  })
})
