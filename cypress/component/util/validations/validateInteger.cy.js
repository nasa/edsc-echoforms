import { validateInteger } from '../../../../src/util/validations/validateInteger'

const validationMessage = 'Value must be a integer between -2,147,483,648 and 2,147,483,647'

describe('validateInteger', () => {
  it('validates an integer as true', () => {
    expect(validateInteger('42')).to.eq(true)
  })

  it('validates a float as false', () => {
    expect(validateInteger('123.456')).to.eq(validationMessage)
  })

  it('validates empty as true', () => {
    expect(validateInteger()).to.eq(true)
  })

  it('validates a string as false', () => {
    expect(validateInteger('not a number')).to.eq(validationMessage)
  })

  it('validates the number is not too large', () => {
    expect(validateInteger('2147483649')).to.eq(validationMessage)
  })

  it('validates the number is not too small', () => {
    expect(validateInteger('-2147483649')).to.eq(validationMessage)
  })
})
