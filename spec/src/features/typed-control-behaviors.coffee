window.sharedBehaviorForTypedControls = (template) ->
  setValue = (value) ->
    $('#control :input').val(value).change()

  describe 'with type="xs:double"', ->
    beforeEach ->
      template.form(dom, attributes: 'type="xs:double"')

    it "accepts a blank value", ->
      setValue('')
      expect('#control').not.toHaveError()

    it "accepts valid doubles", ->
      setValue('1234')
      expect('#control').not.toHaveError()
      setValue('1.234')
      expect('#control').not.toHaveError()
      setValue('1.2e34')
      expect('#control').not.toHaveError()
      setValue('-1.234')
      expect('#control').not.toHaveError()

    it "displays an error for invalid doubles", ->
      setValue('1.2.34')
      expect('#control').toHaveError('Value must be a number')
      setValue('--1234')
      expect('#control').toHaveError('Value must be a number')
      setValue('123four')
      expect('#control').toHaveError('Value must be a number')
      setValue('one234')
      expect('#control').toHaveError('Value must be a number')

  describe 'with type="xs:long"', ->
    beforeEach ->
      template.form(dom, attributes: 'type="xs:long"')

    it "accepts a blank value", ->
      setValue('')
      expect('#control').not.toHaveError()

    it "accepts valid longs", ->
      setValue('1234')
      expect('#control').not.toHaveError()
      setValue('-1234')
      expect('#control').not.toHaveError()
      setValue('2147483648')
      expect('#control').not.toHaveError()

    it "displays an error for non-integer values", ->
      setValue('123.4')
      expect('#control').toHaveError('Value must be an integer between -2^63 and 2^63-1')
      setValue('123four')
      expect('#control').toHaveError('Value must be an integer between -2^63 and 2^63-1')
      setValue('one234')
      expect('#control').toHaveError('Value must be an integer between -2^63 and 2^63-1')

    it "displays an error for integers larger than 64 bits", ->
      setValue('10000000000000000000000000000000000')
      expect('#control').toHaveError('Value must be an integer between -2^63 and 2^63-1')
      setValue('-10000000000000000000000000000000000')
      expect('#control').toHaveError('Value must be an integer between -2^63 and 2^63-1')

  describe 'with type="xs:int"', ->
    beforeEach ->
      template.form(dom, attributes: 'type="xs:int"')

    it "accepts a blank value", ->
      setValue('')
      expect('#control').not.toHaveError()

    it "accepts valid ints", ->
      setValue('0')
      expect('#control').not.toHaveError()
      setValue('-2147483648')
      expect('#control').not.toHaveError()
      setValue('2147483647')
      expect('#control').not.toHaveError()

    it "displays an error for non-integer values", ->
      setValue('123.4')
      expect('#control').toHaveError('Value must be an integer between -2,147,483,648 and 2,147,483,647')
      setValue('123four')
      expect('#control').toHaveError('Value must be an integer between -2,147,483,648 and 2,147,483,647')
      setValue('one234')
      expect('#control').toHaveError('Value must be an integer between -2,147,483,648 and 2,147,483,647')

    it "displays an error for integers larger than 32 bits", ->
      setValue('2147483648')
      expect('#control').toHaveError('Value must be an integer between -2,147,483,648 and 2,147,483,647')
      setValue('-2147483649')
      expect('#control').toHaveError('Value must be an integer between -2,147,483,648 and 2,147,483,647')


  describe 'with type="xs:short"', ->
    beforeEach ->
      template.form(dom, attributes: 'type="xs:short"')

    it "accepts a blank value", ->
      setValue('')
      expect('#control').not.toHaveError()

    it "accepts valid shorts", ->
      setValue('0')
      expect('#control').not.toHaveError()
      setValue('-32768')
      expect('#control').not.toHaveError()
      setValue('32767')
      expect('#control').not.toHaveError()

    it "displays an error for non-integer values", ->
      setValue('123.4')
      expect('#control').toHaveError('Value must be an integer between -32,768 and 32,767')
      setValue('123four')
      expect('#control').toHaveError('Value must be an integer between -32,768 and 32,767')
      setValue('one234')
      expect('#control').toHaveError('Value must be an integer between -32,768 and 32,767')

    it "displays an error for integers larger than 16 bits", ->
      setValue('-32769')
      expect('#control').toHaveError('Value must be an integer between -32,768 and 32,767')
      setValue('32768')
      expect('#control').toHaveError('Value must be an integer between -32,768 and 32,767')

  describe 'with type="xs:dateTime"', ->
    beforeEach ->
      template.form(dom, attributes: 'type="xs:dateTime"')

    it "shows placeholder text when possible", ->
      if $('#control :input').is('input')
        expect($('#control :input').attr('placeholder')).toBe('YYYY-MM-DDTHH:MM:SS')

    it "accepts a blank value", ->
      setValue('')
      expect('#control').not.toHaveError()

    it "accepts valid date times in ISO format", ->
      setValue('2010-01-01T00:00:00')
      expect('#control').not.toHaveError()
      setValue('2100-12-31T23:59:59')
      expect('#control').not.toHaveError()

    it "displays an error for inputs not in ISO date/time format", ->
      setValue('2010-01-01 00:00:00')
      expect('#control').toHaveError('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')
      setValue('2010-01-01')
      expect('#control').toHaveError('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')
      setValue('Not a date')
      expect('#control').toHaveError('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')

    it "displays an error for correctly-formatted inputs which are not valid dates", ->
      setValue('2010-00-01T00:00:00')
      expect('#control').toHaveError('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')
      setValue('2010-13-01T00:00:00')
      expect('#control').toHaveError('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')

      setValue('2010-01-00T00:00:00')
      expect('#control').toHaveError('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')
      setValue('2010-01-32T00:00:00')
      expect('#control').toHaveError('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')

      setValue('2010-01-01T60:00:00')
      expect('#control').toHaveError('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')
      setValue('2010-01-01T00:60:00')
      expect('#control').toHaveError('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')
      setValue('2010-01-01T00:00:60')
      expect('#control').toHaveError('Value must be a date/time with format YYYY-MM-DDTHH:MM:SS')
