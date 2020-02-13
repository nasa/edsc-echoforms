import { checkRelevant } from '../../../src/util/checkRelevant'
import { parseXml } from '../../../src/util/parseXml'
import { notRelevantXml, textfieldXml } from '../../mocks/FormElement'

describe('checkRelevant', () => {
  it('returns true when the relevant attribute does not exist', () => {
    const doc = parseXml(textfieldXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    expect(checkRelevant(null, model)).to.eq(true)
  })

  it('returns the relevant value based on the model', () => {
    const relevant = 'prov:boolreference=\'true\''
    const doc = parseXml(notRelevantXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    expect(checkRelevant(relevant, model)).to.eq(false)
  })
})
