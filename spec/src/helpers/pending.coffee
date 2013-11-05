
window.pending = (desc, func) -> jasmine.getEnv().pending(desc, func)

jasmine.Env.prototype.pending = (description, func) ->
  spec = new jasmine.Spec(this, @currentSuite, description)
  @currentSuite.add(spec);
  @currentSpec = spec;

  spec.runs(-> console.warn("Pending: #{@getFullName()}"))

  spec
