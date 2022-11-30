import { validateDouble } from '../../../../src/util/validations/validateDouble'

describe('validateDouble', () => {
  it('validates a number as true', () => {
    expect(validateDouble('123.456')).to.eq(true)
  })

  it('validates empty as true', () => {
    expect(validateDouble()).to.eq(true)
  })

  it('validates a string as false', () => {
    expect(validateDouble('not a number')).to.eq('Value must be a number')
  })
})
