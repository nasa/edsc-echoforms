beforeEach ->
  $('#dom').remove()
  $('body').prepend('<div id="dom"></div>')

afterEach ->
  if $('#dom').data('echoforms')
    $('#dom').echoforms('destroy')
