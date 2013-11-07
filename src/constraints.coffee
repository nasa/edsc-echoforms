  class BaseConstraint
    constructor: (@message) ->

    check: (value, model, resolver) ->
      console.warn("#{@constructor.name} must override check")


  class PatternConstraint extends BaseConstraint
    constructor: (patternStr, message) ->
      @pattern = new RegExp('^' + patternStr + '$')
      super(message ? 'Invalid')

    check: (value, model, resolver) ->
      !value || @pattern.exec(value) != null;

  class XPathConstraint extends BaseConstraint
    constructor: (@xpath, message) ->
      super(message ? 'Invalid')

    check: (value, model, resolver) ->
      execXPath(model, @xpath, resolver)

  class TypeConstraint extends BaseConstraint
    # Constants
    # 16 bit signed shorts
    @MIN_SHORT = -Math.pow(2, 15)
    @MAX_SHORT = Math.pow(2, 15) - 1

    # 32 bit signed ints
    @MIN_INT = -Math.pow(2, 31)
    @MAX_INT = Math.pow(2, 31) - 1

    # 64 bit signed longs
    # Note: Javascript cannot handle the following two numbers precisely.
    # They are rounded, and differ from the un-rounded numbers by around 200.
    @MIN_LONG = -Math.pow(2, 63)
    @MAX_LONG = Math.pow(2, 63) - 1

    constructor: (rawType, message=null) ->
      match = rawType.match(/^(?:[^:]+:)?(.*)$/)
      @type = if match then match[1] else rawType
      human_type = switch @type
        when "double" then "number"
        when "long" then "integer between -2^63 and 2^63-1"
        when "int" then "integer between -2,147,483,648 and 2,147,483,647"
        when "short" then "integer between -32,768 and 32,767"
        when "datetime" then "date/time with format MM/DD/YYYYTHH:MM:SS"
        when "boolean" then "true or false"
        else @type
      a = if (/^[aeiou]/i).test(human_type) then 'an' else 'a'
      super(message ? "Value must be #{a} #{human_type}")

    check: (value, model, resolver) ->
      return true unless value
      switch @type
        when "string" then true
        when "anyuri" then true
        when "double" then @checkDouble(value)
        when "long" then @checkLong(value)
        when "int" then @checkInt(value)
        when "short" then @checkShort(value)
        when "datetime" then @checkDateTime(value)
        when "boolean" then @checkBoolean(value)
        else
          console.warn("Unable to validate type: ", @type)
          true

    _checkIntegerRange: (min, max, value) ->
      number = Number(value)
      !isNaN(number) && number >= min && number <= max && value.indexOf('.') == -1

    checkDouble: (value) -> !isNaN(Number(value))
    checkLong: (value) -> @_checkIntegerRange(TypeConstraint.MIN_LONG, TypeConstraint.MAX_LONG, value)
    checkInt: (value) -> @_checkIntegerRange(TypeConstraint.MIN_INT, TypeConstraint.MAX_INT, value)
    checkShort: (value) -> @_checkIntegerRange(TypeConstraint.MIN_SHORT, TypeConstraint.MAX_SHORT, value)
    checkBoolean: (value) -> value == 'true' || value == 'false'
    checkDateTime: (value) ->
      return false unless value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
      [date, time] = value.split('T')
      [year, month, day] = (parseInt(t, 10) for t in date.split('-'))
      [hour, minute, second] = (parseInt(t, 10) for t in time.split(':'))

      (1 <= month <= 12 and
       1 <= day <= 31 and
       hour < 24 and
       minute < 60 and
       second < 60)

  class RequiredConstraint extends BaseConstraint
    constructor: (@xpath, message="Required field") ->
      super(message)

    check: (value, model, resolver) ->
      value = null if value instanceof Array and value.length == 0
      !!value || !execXPath(model, @xpath, resolver)
