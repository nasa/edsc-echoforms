import { validateLong } from '../../../../../src/util/validations/validateLong'

describe('validateLong', () => {
  it('validates an integer as true', () => {
    expect(validateLong('42')).to.eq(true)
  })

  it('validates a float as false', () => {
    expect(validateLong('123.456')).to.eq(false)
  })

  it('validates empty as true', () => {
    expect(validateLong()).to.eq(true)
  })

  it('validates a string as false', () => {
    expect(validateLong('not a number')).to.eq(false)
  })

  it('validates the number is not too large', () => {
    expect(validateLong('92233720368547760000')).to.eq(false)
  })

  it('validates the number is not too small', () => {
    expect(validateLong('-92233720368547760000')).to.eq(false)
  })
})
