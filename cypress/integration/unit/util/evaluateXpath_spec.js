import { evaluateXpath } from '../../../../src/util/evaluateXpath'
import { parseXml } from '../../../../src/util/parseXml'
import { groupXml, readOnlyXml } from '../../../mocks/FormElement'
import { buildXPathResolverFn } from '../../../../src/util/buildXPathResolverFn'

describe('evaluateXpath', () => {
  it('returns an element result from xpath', () => {
    const ref = 'prov:groupreference'
    const doc = parseXml(groupXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    expect(evaluateXpath(ref, model, resolver).outerHTML).to.eq('<prov:groupreference xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:groupreference>')
  })

  it('returns a boolean result from xpath', () => {
    const ref = 'prov:boolreference=\'true\''
    const doc = parseXml(readOnlyXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    expect(evaluateXpath(ref, model, resolver)).to.eq(true)
  })
})
