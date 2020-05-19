import { isArrayEqual } from '../../../../src/util/isArrayEqual'

describe('isArrayEqual', () => {
  it('returns false if the arrays have different lengths', () => {
    const array1 = [1, 2, 3]
    const array2 = [1]

    expect(isArrayEqual(array1, array2)).to.eq(false)
  })

  it('returns false if the arrays have different values', () => {
    const array1 = [1, 2, 3]
    const array2 = [4, 5, 6]

    expect(isArrayEqual(array1, array2)).to.eq(false)
  })

  it('returns true if the arrays are equal', () => {
    const array1 = [1, 2, 3]
    const array2 = [1, 2, 3]

    expect(isArrayEqual(array1, array2)).to.eq(true)
  })
})
