import { getNodeValue } from '../../../../src/util/getNodeValue'
import { parseXml } from '../../../../src/util/parseXml'
import { selectXml, textareaXml } from '../../../mocks/FormElement'

describe('getNodeValue', () => {
  it('returns the value from the model', () => {
    const ref = 'prov:textreference'
    const doc = parseXml(textareaXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    expect(getNodeValue(ref, model)).to.eq('test value')
  })

  it('returns an array value from the model', () => {
    const ref = 'prov:selectreference'
    const doc = parseXml(selectXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    expect(getNodeValue(ref, model)).to.eql([
      'value 1',
      'value 2'
    ])
  })
})
