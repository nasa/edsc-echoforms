matchList = [
  require('./checkbox.coffee')
  require('./input.coffee')
  require('./urloutput.coffee')
  require('./output.coffee')
  require('./select.coffee')
  require('./range.coffee')
  require('./secret.coffee')
  require('./textarea.coffee')
  require('./group.coffee')
  require('./selectref.coffee')
]

unmatched = [
  require('./base.coffee')
  require('./typed.coffee')
  require('./grouping.coffee')
]

classes = {}

(classes[c.name] = c for c in matchList.concat(unmatched))

module.exports =
  matchList: matchList
  classes: classes
  extras:
    RangeSlider: require('./extras/rangeslider.coffee')
