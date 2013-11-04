  # Needed for IE < 8 compatibility.  This is defined in 1.8.1
  String.prototype.trim ?= -> this.replace(/^\s*/, "").replace(/\s*$/, "");

  isFunction = (obj) ->
    !!(object && getClass.call(object) == '[object Function]')

  nearest = (el, selector) ->
    $(el).find(selector).filter ->
      !$(this).parentsUntil(el, selector).length
