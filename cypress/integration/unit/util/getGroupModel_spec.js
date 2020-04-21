import { getGroupModel } from '../../../../src/util/getGroupModel'
import { parseXml } from '../../../../src/util/parseXml'
import { groupXml } from '../../../mocks/FormElement'

describe('getGroupModel', () => {
  it('returns the model from the group\'s ref', () => {
    const ref = 'prov:groupreference'
    const doc = parseXml(groupXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    expect(getGroupModel(ref, model).outerHTML).to.eq('<prov:groupreference xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:groupreference>')
  })
})
