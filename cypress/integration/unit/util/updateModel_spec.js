import { parseXml } from '../../../../src/util/parseXml'
import { textfieldXml, selectXml, multipleNamespacesXml } from '../../../mocks/FormElement'
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

  it('returns the updated model when it uses multiple xml namespaces', () => {
    const doc = parseXml(multipleNamespacesXml)
    const modelResult = doc.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    expect(updateModel(
      model,
      resolver,
      'ecs2:subsetSpecification/ecs2:fileFormat',
      {
        value: ['GeoTIFF'],
        valueElementName: 'fileFormatValue'
      }
    ).firstElementChild.outerHTML).to.eq('<ecs:options xmlns:ecs="http://ecs.nasa.gov/options" xmlns:ecs2="http://ecs2.nasa.gov/options"><ecs2:subsetSpecification><ecs2:fileFormat criteriaName="File Format" criteriaType="FIXED"><ecs2:fileFormatValue>GeoTIFF</ecs2:fileFormatValue></ecs2:fileFormat></ecs2:subsetSpecification></ecs:options>')
  })
})
