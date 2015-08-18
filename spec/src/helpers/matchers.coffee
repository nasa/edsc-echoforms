beforeEach ->
  jasmine.addMatchers
    toHaveError: (util, customEqualityTesters) ->
      compare: (actual, expected) ->
        control = $(actual)

        result = {pass: false}
        for message in control.children('.echoforms-errors').children('.echoforms-error')
          result.pass = true if $.trim($(message).text()) == expected or !expected?

        if result.pass
          result.message = "Expected #{actual} not to have error #{expected}"
        else
          result.message = "Expected #{actual} to have error #{expected}"
        result

    toBeReadonly: (util, customEqualityTesters) ->
      compare: (actual) ->
        control = $(actual)
        pass: control.is('.echoforms-readonly') && control.find(':input').not('[readonly]').length == 0

    toMatchXml: (util, customEqualityTesters) ->
      compare: (actual, expected) ->
        expected = expected.replace(/\s+/g, ' ').replace('> <', '><')
        actual = actual.replace(/\s+/g, ' ').replace('> <', '><')

        pass: expected == actual
