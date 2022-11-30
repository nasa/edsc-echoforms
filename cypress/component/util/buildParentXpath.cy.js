import { buildParentXpath } from '../../../src/util/buildParentXpath'

describe('buildParentXpath', () => {
  it('concatenates parent and child xpath', () => {
    const parent = 'parent'
    const child = 'child'

    expect(buildParentXpath(parent, child)).to.eq('parent/child')
  })

  it('does not concatenate parent and child xpath if child is absolute (/)', () => {
    const parent = 'parent'
    const child = '/child/path'

    expect(buildParentXpath(parent, child)).to.eq('/child/path')
  })

  it('does not concatenate parent and child xpath if child is absolute (//)', () => {
    const parent = 'parent'
    const child = '//child/path'

    expect(buildParentXpath(parent, child)).to.eq('//child/path')
  })
})
