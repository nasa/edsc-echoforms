import { getNodeValue } from '../../../src/util/getNodeValue'
import { parseXml } from '../../../src/util/parseXml'
import { textfieldXml } from '../../mocks/FormElement'

describe('getNodeValue', () => {
  it('returns the value from the model', () => {
    const ref = 'prov:textreference'
    const doc = parseXml(textfieldXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    expect(getNodeValue(ref, model)).to.eq('test value')
  })
})
