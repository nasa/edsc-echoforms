import { validateShort } from '../../../../../src/util/validations/validateShort'

describe('validateShort', () => {
  it('validates an integer as true', () => {
    expect(validateShort('42')).to.eq(true)
  })

  it('validates a float as false', () => {
    expect(validateShort('123.456')).to.eq(false)
  })

  it('validates empty as true', () => {
    expect(validateShort()).to.eq(true)
  })

  it('validates a string as false', () => {
    expect(validateShort('not a number')).to.eq(false)
  })

  it('validates the number is not too large', () => {
    expect(validateShort('32769')).to.eq(false)
  })

  it('validates the number is not too small', () => {
    expect(validateShort('-32769')).to.eq(false)
  })
})
