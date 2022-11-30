import { parseXml } from '../../../src/util/parseXml'
import { buildXPathResolverFn } from '../../../src/util/buildXPathResolverFn'

import { hasModelChanged } from '../../../src/util/hasModelChanged'

describe('hasModelChanged', () => {
  it('returns false if the models are the same', () => {
    const model1String = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'
    const model2String = model1String
    const doc1 = parseXml(model1String)
    const modelResult1 = doc1.evaluate('//*[local-name()="instance"]', doc1)
    const model1 = modelResult1.iterateNext()
    const resolver = buildXPathResolverFn(doc1)

    const doc2 = parseXml(model2String)
    const modelResult2 = doc2.evaluate('//*[local-name()="instance"]', doc2)
    const model2 = modelResult2.iterateNext()

    expect(hasModelChanged(model1, model2, resolver)).to.eq(false)
  })

  it('returns false if the models are the same ignoring email differences', () => {
    const model1String = '<form><model><instance><ecs:options xmlns:ecs="http://www.example.com/orderoptions"><ecs:email/><ecs:textreference>test value</ecs:textreference></ecs:options></instance></model><ui><input id="textinput" label="Text input" ref="ecs:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'
    const model2String = model1String.replace('<ecs:email/>', '<ecs:email>test@example.com</ecs:email>')

    const doc1 = parseXml(model1String)
    const modelResult1 = doc1.evaluate('//*[local-name()="instance"]', doc1)
    const model1 = modelResult1.iterateNext()
    const resolver = buildXPathResolverFn(doc1)

    const doc2 = parseXml(model2String)
    const modelResult2 = doc2.evaluate('//*[local-name()="instance"]', doc2)
    const model2 = modelResult2.iterateNext()

    expect(hasModelChanged(model1, model2, resolver)).to.eq(false)
  })

  it('returns false if the models are the same ignoring INCLUDE_META differences', () => {
    const model1String = '<form><model><instance><ecs:options xmlns:ecs="http://www.example.com/orderoptions"><ecs:email/><ecs:textreference>test value</ecs:textreference><ecs:INCLUDE_META>false</ecs:INCLUDE_META></ecs:options></instance></model><ui><input id="textinput" label="Text input" ref="ecs:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'
    const model2String = model1String.replace('<ecs:INCLUDE_META>false</ecs:INCLUDE_META>', '<ecs:INCLUDE_META>true</ecs:INCLUDE_META>')

    const doc1 = parseXml(model1String)
    const modelResult1 = doc1.evaluate('//*[local-name()="instance"]', doc1)
    const model1 = modelResult1.iterateNext()
    const resolver = buildXPathResolverFn(doc1)

    const doc2 = parseXml(model2String)
    const modelResult2 = doc2.evaluate('//*[local-name()="instance"]', doc2)
    const model2 = modelResult2.iterateNext()

    expect(hasModelChanged(model1, model2, resolver)).to.eq(false)
  })

  it('returns true if the models are different', () => {
    const model1String = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'
    const model2String = model1String.replace(
      '<prov:textreference>test value</prov:textreference>',
      '<prov:textreference>test value 1</prov:textreference>'
    )

    const doc1 = parseXml(model1String)
    const modelResult1 = doc1.evaluate('//*[local-name()="instance"]', doc1)
    const model1 = modelResult1.iterateNext()
    const resolver = buildXPathResolverFn(doc1)

    const doc2 = parseXml(model2String)
    const modelResult2 = doc2.evaluate('//*[local-name()="instance"]', doc2)
    const model2 = modelResult2.iterateNext()

    expect(hasModelChanged(model1, model2, resolver)).to.eq(true)
  })

  it('returns false if the only differences are irrelevant fields', () => {
    const model1String = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'
    const model2String = model1String.replace(
      '<prov:textreference>test value</prov:textreference>',
      '<prov:textreference irrelevant="true">test value 1</prov:textreference>'
    )

    const doc1 = parseXml(model1String)
    const modelResult1 = doc1.evaluate('//*[local-name()="instance"]', doc1)
    const model1 = modelResult1.iterateNext()
    const resolver = buildXPathResolverFn(doc1)

    const doc2 = parseXml(model2String)
    const modelResult2 = doc2.evaluate('//*[local-name()="instance"]', doc2)
    const model2 = modelResult2.iterateNext()

    expect(hasModelChanged(model1, model2, resolver)).to.eq(false)
  })

  it('returns false if the only differences are irrelevant parent fields', () => {
    const model1String = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:group irrelevant="true"><prov:textreference>test value</prov:textreference></prov:group></prov:options></instance></model><ui><group ref="prov:group" relevant="false"><input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help></input></group></ui></form>'
    const model2String = model1String.replace(
      '<prov:textreference>test value</prov:textreference>',
      '<prov:textreference>test value 1</prov:textreference>'
    )

    const doc1 = parseXml(model1String)
    const modelResult1 = doc1.evaluate('//*[local-name()="instance"]', doc1)
    const model1 = modelResult1.iterateNext()
    const resolver = buildXPathResolverFn(doc1)

    const doc2 = parseXml(model2String)
    const modelResult2 = doc2.evaluate('//*[local-name()="instance"]', doc2)
    const model2 = modelResult2.iterateNext()

    expect(hasModelChanged(model1, model2, resolver)).to.eq(false)
  })
})
