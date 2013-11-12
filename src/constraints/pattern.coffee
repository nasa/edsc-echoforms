  class PatternConstraint extends BaseConstraint
    constructor: (patternStr, message) ->
      @pattern = new RegExp('^' + patternStr + '$')
      super(message ? 'Invalid')

    check: (value, model, resolver) ->
      !value || @pattern.exec(value) != null;
