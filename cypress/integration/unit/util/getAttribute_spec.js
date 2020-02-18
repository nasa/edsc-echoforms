import { getAttribute } from '../../../../src/util/getAttribute'
import { parseXml } from '../../../../src/util/parseXml'
import { textfieldXml } from '../../../mocks/FormElement'

describe('getAttribute', () => {
  it('returns the attribute value', () => {
    const doc = parseXml(textfieldXml)
    const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
    const ui = uiResult.iterateNext()
    const element = ui.children[0]
    const { attributes } = element

    expect(getAttribute(attributes, 'label')).to.eq('Text input')
  })

  it('returns null if the attribute does not exist', () => {
    const doc = parseXml(textfieldXml)
    const uiResult = document.evaluate('//*[local-name()="ui"]', doc)
    const ui = uiResult.iterateNext()
    const element = ui.children[0]
    const { attributes } = element

    expect(getAttribute(attributes, 'fake')).to.eq(null)
  })
})
