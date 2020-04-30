import { validateLong } from '../../../../../src/util/validations/validateLong'

const validationMessage = 'Value must be a integer between -2^63 and 2^63-1'

describe('validateLong', () => {
  it('validates an integer as true', () => {
    expect(validateLong('42')).to.eq(true)
  })

  it('validates a float as false', () => {
    expect(validateLong('123.456')).to.eq(validationMessage)
  })

  it('validates empty as true', () => {
    expect(validateLong()).to.eq(true)
  })

  it('validates a string as false', () => {
    expect(validateLong('not a number')).to.eq(validationMessage)
  })

  it('validates the number is not too large', () => {
    expect(validateLong('92233720368547760000')).to.eq(validationMessage)
  })

  it('validates the number is not too small', () => {
    expect(validateLong('-92233720368547760000')).to.eq(validationMessage)
  })
})
