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
      model.xpath(@xpath, resolver)[0]

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
      a = if (/^[aeiou]/i).test(@type) then 'an' else 'a'
      super(message ? "Value must be #{a} #{@type}")

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
      console.warn("Implement datetime validation")
      true

  class RequiredConstraint extends BaseConstraint
    constructor: (@xpath, message="Required field") ->
      super(message)

    check: (value, model, resolver) ->
      !!value || !model.xpath(@xpath, resolver)[0]

  class ItemCountConstraint extends BaseConstraint
    constructor: (@count, message=null) ->
      super(message ? @buildMessage())

    itemWord: ->
      if @count == 1 then "item" else "items"

  class MinItemsConstraint extends ItemCountConstraint
    buildMessage: -> "At least #{@count} #{@itemWord()} required"

  class MaxItemsConstraint extends ItemCountConstraint
    buildMessage: -> "No more than #{@count} #{@itemWord()} allowed"
