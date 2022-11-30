import { getNodeValue } from '../../../src/util/getNodeValue'
import { parseXml } from '../../../src/util/parseXml'
import { selectXml, textareaXml, emptyTreeXml } from '../../mocks/FormElement'
import { buildXPathResolverFn } from '../../../src/util/buildXPathResolverFn'

describe('getNodeValue', () => {
  it('returns the value from the model', () => {
    const ref = 'prov:textreference'
    const doc = parseXml(textareaXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(getNodeValue(ref, model.firstElementChild, resolver)).to.eq('test value')
  })

  it('returns an array value from the model', () => {
    const ref = 'prov:selectreference'
    const doc = parseXml(selectXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(getNodeValue(ref, model.firstElementChild, resolver)).to.eql([
      'test value 1',
      'test value 2'
    ])
  })

  it('returns an empty array for an empty tree value', () => {
    const ref = 'prov:treeReference'
    const doc = parseXml(emptyTreeXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(getNodeValue(ref, model.firstElementChild, resolver, false, true)).to.eql([])
  })

  it('returns a boolean result', () => {
    const ref = 'false()'
    const doc = parseXml(textareaXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(getNodeValue(ref, model.firstElementChild, resolver)).to.eq(false)
  })

  it('returns a boolean when the xpath is a boolean', () => {
    const ref = 'false'
    const doc = parseXml(textareaXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(getNodeValue(ref, model.firstElementChild, resolver)).to.eq(false)
  })

  it('returns false when a boolean field xpath returns null', () => {
    const ref = 'prov:selectrefReference[prov:value=\'wrong value\']'
    const doc = parseXml(selectXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(getNodeValue(ref, model.firstElementChild, resolver, true)).to.eql(false)
  })
})
