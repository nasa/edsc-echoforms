import { validateDateTime } from '../../../../../src/util/validations/validateDateTime'

describe('validateDateTime', () => {
  it('validates a ISO date as true', () => {
    expect(validateDateTime('2020-01-01T00:00:00')).to.eq(true)
  })

  it('validates empty as true', () => {
    expect(validateDateTime()).to.eq(true)
  })

  it('validates an incorrect value as false', () => {
    expect(validateDateTime('asdf')).to.eq('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')
  })

  it('validates an incorrect date as false', () => {
    expect(validateDateTime('2020-01-35T00:00:00')).to.eq('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')
  })
})
