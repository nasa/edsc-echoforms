beforeEach ->
  @addMatchers
    toHaveHelp: (expected) ->
      actual = @actual
      actual = [actual] unless actual instanceof Array

      messages = []
      result = !@isNot
      for id in actual
        el = $("##{id}")
        if el.is('.echoforms-control')
          help = el.children('.echoforms-help')
          matched = $.trim(help.text()) == expected
          if matched and @isNot
            result = true
            messages.push "Expected '#{id}' to not have help text '#{expected}'"
          if !matched and !@isNot
            result = false
            messages.push "Expected '#{id}' to have help text '#{expected}'"
        else
          result = @isNot
          messages.push "Could not find element of class 'echoforms-control' with id '#{id}'"

      @message = ->
        messages.join('. ')

      result

    toHaveError: (expected) ->
      control = $(@actual)

      for message in control.children('.echoforms-errors').children('.echoforms-error')
        return true if $.trim($(message).text()) == expected or !expected?

      false

    toBeReadonly: () ->
      control = $(@actual)
      control.is('.echoforms-readonly') && control.find(':input').not('[readonly]').length == 0
