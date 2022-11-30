import { validateShort } from '../../../../src/util/validations/validateShort'

const validationMessage = 'Value must be a integer between -32,768 and 32,767'

describe('validateShort', () => {
  it('validates an integer as true', () => {
    expect(validateShort('42')).to.eq(true)
  })

  it('validates a float as false', () => {
    expect(validateShort('123.456')).to.eq(validationMessage)
  })

  it('validates empty as true', () => {
    expect(validateShort()).to.eq(true)
  })

  it('validates a string as false', () => {
    expect(validateShort('not a number')).to.eq(validationMessage)
  })

  it('validates the number is not too large', () => {
    expect(validateShort('32769')).to.eq(validationMessage)
  })

  it('validates the number is not too small', () => {
    expect(validateShort('-32769')).to.eq(validationMessage)
  })
})
