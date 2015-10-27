window.sharedBehaviorForGroupingControls = (template) ->

  it "scopes child control xpaths", ->
    template.form($('#dom'))
    $('#childReference :input').val('value1').change()
    expect($('#child :input').val()).toBe('value1')
    $('#child :input').val('value2').change()
    expect($('#childReference :input').val()).toBe('value2')
