import { evaluateXpath } from '../../../src/util/evaluateXpath'
import { parseXml } from '../../../src/util/parseXml'
import { groupXml, readOnlyXml } from '../../mocks/FormElement'
import { buildXPathResolverFn } from '../../../src/util/buildXPathResolverFn'

describe('evaluateXpath', () => {
  it('returns an element result from xpath', () => {
    const ref = 'prov:groupreference'
    const doc = parseXml(groupXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(evaluateXpath(ref, model.firstElementChild, resolver).outerHTML).to.eq('<prov:groupreference xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:groupreference>')
  })

  it('returns a boolean result from xpath', () => {
    const ref = 'prov:boolreference=\'true\''
    const doc = parseXml(readOnlyXml)
    const modelResult = document.evaluate('//*[local-name()="instance"]', doc)
    const model = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)

    // Use firstElementChild to run the xpath on the correct context
    expect(evaluateXpath(ref, model.firstElementChild, resolver)).to.eq(true)
  })

  it('evaluates absolute xpath (/) within a limited node context', () => {
    // Absolute xpath should return the full groupreference
    const ref = '/prov:options/prov:groupreference'
    const doc = parseXml(groupXml)

    // Limit the model to the group's children
    const modelResult = document.evaluate('//*[local-name()="groupreference"]/*', doc)
    const groupModel = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)
    const result = evaluateXpath(ref, groupModel, resolver)

    // Passing limited model and absolute xpath returns data outside the limited model
    expect(result.outerHTML).to.eq('<prov:groupreference xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:groupreference>')
  })

  it('evaluates absolute xpath (//) within a limited node context', () => {
    // Absolute xpath should return the full groupreference
    const ref = '//prov:groupreference'
    const doc = parseXml(groupXml)

    // Limit the model to the group's children
    const modelResult = document.evaluate('//*[local-name()="groupreference"]/*', doc)
    const groupModel = modelResult.iterateNext()
    const resolver = buildXPathResolverFn(doc)
    const result = evaluateXpath(ref, groupModel, resolver)

    // Passing limited model and absolute xpath returns data outside the limited model
    expect(result.outerHTML).to.eq('<prov:groupreference xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:groupreference>')
  })
})
