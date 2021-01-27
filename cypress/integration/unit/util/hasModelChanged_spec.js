const { hasModelChanged } = require('../../../../src/util/hasModelChanged')

describe('hasModelChanged', () => {
  it('returns false if the models are the same', () => {
    const model1 = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'
    const model2 = model1

    expect(hasModelChanged(model1, model2)).to.eq(false)
  })

  it('returns false if the models are the same ignoring email differences', () => {
    const model1 = '<form><model><instance><ecs:options xmlns:ecs="http://www.example.com/orderoptions"><ecs:email/><ecs:textreference>test value</ecs:textreference></ecs:options></instance></model><ui><input id="textinput" label="Text input" ref="ecs:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'
    const model2 = model1.replace('<ecs:email/>', '<ecs:email>test@example.com</ecs:email>')

    expect(hasModelChanged(model1, model2)).to.eq(false)
  })

  it('returns false if the models are the same ignoring INCLUDE_META differences', () => {
    const model1 = '<form><model><instance><ecs:options xmlns:ecs="http://www.example.com/orderoptions"><ecs:email/><ecs:textreference>test value</ecs:textreference><ecs:INCLUDE_META>false</ecs:INCLUDE_META></ecs:options></instance></model><ui><input id="textinput" label="Text input" ref="ecs:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'
    const model2 = model1.replace('<ecs:INCLUDE_META>false</ecs:INCLUDE_META>', '<ecs:INCLUDE_META>true</ecs:INCLUDE_META>')

    expect(hasModelChanged(model1, model2)).to.eq(false)
  })

  it('returns true if the models are different', () => {
    const model1 = '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:textreference>test value</prov:textreference></prov:options></instance></model><ui><input id="textinput" label="Text input" ref="prov:textreference" type="xs:string"><help>Helpful text</help></input></ui></form>'
    const model2 = model1.replace(
      '<prov:textreference>test value</prov:textreference>',
      '<prov:textreference>test value 1</prov:textreference>'
    )

    expect(hasModelChanged(model1, model2)).to.eq(true)
  })
})
