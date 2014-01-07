classes =
  Checkbox: require('./checkbox.coffee')
  Input: require('./input.coffee')
  UrlOutput: require('./urloutput.coffee')
  Output: require('./output.coffee')
  Select: require('./select.coffee')
  Range: require('./range.coffee')
  Secret: require('./secret.coffee')
  Textarea: require('./textarea.coffee')
  Group: require('./group.coffee')
  Select: require('./select.coffee')
  Selectref: require('./selectref.coffee')
  Base: require('./base.coffee')
  Typed: require('./typed.coffee')
  Grouping: require('./grouping.coffee')

matchList = [
  classes.Checkbox,
  classes.Input,
  classes.UrlOutput,
  classes.Output,
  classes.Select,
  classes.Range,
  classes.Secret,
  classes.Group,
  classes.Select,
  classes.Selectref,
  classes.Textarea
]

module.exports =
  matchList: matchList
  classes: classes
  extras:
    RangeSlider: require('./extras/rangeslider.coffee')
