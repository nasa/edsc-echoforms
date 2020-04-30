import { evaluateXpath } from '../../../../src/util/evaluateXpath'
import { parseXml } from '../../../../src/util/parseXml'
import { groupXml, readOnlyXml } from '../../../mocks/FormElement'

describe('evaluateXpath', () => {
  it('returns an element result from xpath', () => {
    const ref = 'prov:groupreference'
    const doc = parseXml(groupXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    expect(evaluateXpath(ref, model).outerHTML).to.eq('<prov:groupreference xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:groupreference>')
  })

  it('returns a boolean result from xpath', () => {
    const ref = 'prov:boolreference=\'true\''
    const doc = parseXml(readOnlyXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    expect(evaluateXpath(ref, model)).to.eq(true)
  })
})
