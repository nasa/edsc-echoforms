  class BaseConstraint
    constructor: (@message) ->

  class PatternConstraint extends BaseConstraint
    constructor: (@pattern, message) ->
      super(message ? 'Invalid')

  class XPathConstraint extends BaseConstraint
    constructor: (@xpath, message) ->
      super(message ? 'Invalid')

  class TypeConstraint extends BaseConstraint
    constructor: (@type, message=null) ->
      super(message ? "Value must be a #{@type}")

  class RequiredConstraint extends BaseConstraint
    constructor: (@xpath, message="Required field") ->
      super(message)

  class ItemCountConstraint extends BaseConstraint
    constructor: (@count, message=null) ->
      super(message ? @buildMessage())

    itemWord: ->
      if @count == 1 then "item" else "items"

  class MinItemsConstraint extends ItemCountConstraint
    buildMessage: -> "At least #{@count} #{@itemWord()} required"

  class MaxItemsConstraint extends ItemCountConstraint
    buildMessage: -> "No more than #{@count} #{@itemWord()} allowed"
