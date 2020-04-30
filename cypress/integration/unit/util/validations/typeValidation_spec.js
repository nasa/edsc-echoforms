import { typeValidation } from '../../../../../src/util/validations/typeValidation'

describe('typeValidation', () => {
  it('validates a datetime', () => {
    expect(typeValidation('datetime', '2020-01-01T00:00:00')).to.eq(true)
  })

  it('validates a double', () => {
    expect(typeValidation('double', '123.456')).to.eq(true)
  })

  it('validates a long', () => {
    expect(typeValidation('long', '42')).to.eq(true)
  })

  it('validates a integer', () => {
    expect(typeValidation('int', '42')).to.eq(true)
  })

  it('validates a short', () => {
    expect(typeValidation('short', '42')).to.eq(true)
  })

  it('returns true if no value exists', () => {
    expect(typeValidation('double', null)).to.eq(true)
  })

  it('returns true by default', () => {
    expect(typeValidation(null, 'test')).to.eq(true)
  })
})
