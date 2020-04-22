import { parseXml } from '../../../../src/util/parseXml'
import { textfieldXml, selectXml } from '../../../mocks/FormElement'
import { updateModel } from '../../../../src/util/updateModel'

describe('updateModel', () => {
  it('returns the updated model with a single value', () => {
    const doc = parseXml(textfieldXml)
    const modelResult = doc.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    expect(updateModel(model, 'prov:textreference', 'new value').outerHTML).to.eq('<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>new value</prov:textreference></prov:options>')
  })

  it('returns the updated model with an array value', () => {
    const doc = parseXml(selectXml)
    const modelResult = doc.evaluate('//*[local-name()="instance"]/*', doc)
    const model = modelResult.iterateNext()

    expect(updateModel(
      model,
      'prov:selectreference',
      [
        {
          value: 'value1',
          valueElementName: 'value'
        },
        {
          value: 'value2',
          valueElementName: 'value'
        }
      ]
    ).outerHTML).to.eq('<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:selectreference><prov:value>value1</prov:value><prov:value>value2</prov:value></prov:selectreference></prov:options>')
  })
})
