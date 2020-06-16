import { parseXml } from '../../../../src/util/parseXml'
import { textfieldXml, selectXml } from '../../../mocks/FormElement'
import { updateModel } from '../../../../src/util/updateModel'
import { buildXPathResolverFn } from '../../../../src/util/buildXPathResolverFn'

describe('updateModel', () => {
  it('returns the updated model with a single value', () => {
    const doc = parseXml(textfieldXml)
    const modelResult = doc.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    expect(updateModel(model, resolver, 'prov:textreference', 'new value').firstElementChild.outerHTML).to.eq('<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>new value</prov:textreference></prov:options>')
  })

  it('returns the updated model with an array value', () => {
    const doc = parseXml(selectXml)
    const modelResult = doc.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    expect(updateModel(
      model,
      resolver,
      'prov:selectreference',
      {
        value: ['value1', 'value2'],
        valueElementName: 'value'
      }
    ).firstElementChild.outerHTML).to.eq('<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:selectreference><prov:value>value1</prov:value><prov:value>value2</prov:value></prov:selectreference></prov:options>')
  })
})
