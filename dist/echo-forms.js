(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($, window, document) {
    var BaseEchoFormsConstraint, BaseEchoFormsControl, EchoForm, EchoFormsCheckboxControl, EchoFormsContainerControl, EchoFormsDefaultControl, EchoFormsInterface, EchoFormsOutputControl, defaultControls, defaults, isFunction, nearest, pluginName, _base, _ref, _ref1, _ref2, _ref3;
    if ((_base = String.prototype).trim == null) {
      _base.trim = function() {
        return this.replace(/^\s*/, "").replace(/\s*$/, "");
      };
    }
    isFunction = function(obj) {
      return !!(object && getClass.call(object) === '[object Function]');
    };
    nearest = function(el, selector) {
      return $(el).find(selector).filter(function() {
        return !$(this).parentsUntil(el, selector).length;
      });
    };
    defaultControls = [EchoFormsContainerControl, EchoFormsCheckboxControl, EchoFormsOutputControl, EchoFormsDefaultControl];
    pluginName = "echoform";
    defaults = {
      controls: []
    };
    EchoForm = (function() {
      function EchoForm(xml) {
        console.log(xml);
        this.document = xmlParse(xml);
        console.log(this.document);
        this.root = this.document.firstChild;
        this.root.prefixElements();
        $(document).trigger('echoforms:instanceChange', this);
      }

      EchoForm.prototype.find = function(parent, xpath) {
        var context;
        context = new ExprContext(parent != null ? parent : this.root);
        return xpathParse(xpath).evaluate(context).value;
      };

      EchoForm.prototype.update = function(parent, xpath, valueElement, value) {
        var node, nodes, _i, _len;
        if (valueElement != null) {
          valueElement = this.namespace(parent, valueElement);
        }
        nodes = xpath ? this.find(parent, xpath) : [parent];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          node.setValues(value, valueElement);
        }
        return $(document).trigger('echoforms:instanceChange', this);
      };

      EchoForm.prototype.namespace = function(parentNode, childName) {
        var childNode;
        childNode = XNode.create(DOM_ELEMENT_NODE, childName, null, null);
        if (childNode.getNamespacePrefix() == null) {
          childNode.setNamespacePrefix(parentNode.getNamespacePrefix());
        }
        return childNode.nodeName;
      };

      EchoForm.prototype.prune = function(parent, xpath) {
        return XNode.removeAll(this.find(parent, xpath));
      };

      EchoForm.prototype.serialize = function() {
        return xmlText(this.document);
      };

      return EchoForm;

    })();
    BaseEchoFormsControl = (function() {
      function BaseEchoFormsControl(el) {
        this.el = el;
        this.changed = __bind(this.changed, this);
        this.inputs().bind('click change', onChange);
      }

      BaseEchoFormsControl.prototype.isChanged = function(newValue) {
        return this.getValue().toString().trim() !== newValue.toString().trim();
      };

      BaseEchoFormsControl.prototype.changed = function(newValue) {
        return this.el.trigger('echoforms:controlchange', this.el, this, newValue);
      };

      BaseEchoFormsControl.prototype.inputSelector = ':input';

      BaseEchoFormsControl.prototype.inputs = function() {
        return this.inputs != null ? this.inputs : this.inputs = this.el.find(this.inputSelector);
      };

      BaseEchoFormsControl.prototype.relevant = function(arg) {
        var isRelevant;
        if (arg != null) {
          isRelevant = !!arg;
          if (isRelevant !== this.relevant()) {
            el.toggleClass('echoforms-irrelevant', !isRelevant);
            return el.toggle(isRelevant);
          }
        } else {
          return !el.hasClass('echoforms-irrelevant');
        }
      };

      BaseEchoFormsControl.prototype.readonly = function(arg) {
        var isReadonly;
        if (arg != null) {
          isReadonly = !!arg;
          if (isReadonly !== this.readonly()) {
            el.toggleClass('echoforms-readonly ui-state-disabled', isReadonly);
            return this.updateReadonly(isReadonly);
          }
        } else {
          return el.hasClass('echoforms-readonly');
        }
      };

      BaseEchoFormsControl.prototype.updateReadonly = function(isReadonly) {
        this.inputs().attr('disabled', isReadonly);
        return this.inputs().attr('readonly', isReadonly);
      };

      BaseEchoFormsControl.prototype.value = function(arg) {
        if (arg != null) {
          if (this.isChanged()) {
            this.setValue(arg);
            return this.changed(arg);
          }
        } else {
          return this.getValue();
        }
      };

      BaseEchoFormsControl.prototype.getValue = function() {};

      BaseEchoFormsControl.prototype.setValue = function() {
        var _this = this;
        return {
          onChange: function(e) {
            return _this.changed(_this.getValue());
          }
        };
      };

      return BaseEchoFormsControl;

    })();
    EchoFormsContainerControl = (function(_super) {
      __extends(EchoFormsContainerControl, _super);

      function EchoFormsContainerControl() {
        _ref = EchoFormsContainerControl.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      EchoFormsContainerControl.selector = '.echoforms-group, .echoforms-repeat';

      EchoFormsContainerControl.prototype.inputs = function() {
        return $();
      };

      EchoFormsContainerControl.prototype.getValue = function() {
        var ui;
        if (this.el.data('echoformsRef')) {
          ui = this.el.closest('.echoforms-echoform').data('echoformsInterface');
          return ui.instanceValue(this.el, 'echoformsRef');
        }
      };

      return EchoFormsContainerControl;

    })(BaseEchoFormsControl);
    EchoFormsCheckboxControl = (function(_super) {
      __extends(EchoFormsCheckboxControl, _super);

      function EchoFormsCheckboxControl() {
        _ref1 = EchoFormsCheckboxControl.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      EchoFormsCheckboxControl.selector = '.echoforms-control-checkbox';

      EchoFormsCheckboxControl.prototype.inputSelector = ':checkbox';

      EchoFormsCheckboxControl.prototype.getValue = function() {
        return this.inputs().is(':checked');
      };

      EchoFormsCheckboxControl.prototype.setValue = function(value) {
        return this.inputs().attr('checked', value.toString() === true);
      };

      return EchoFormsCheckboxControl;

    })(BaseEchoFormsControl);
    EchoFormsOutputControl = (function(_super) {
      __extends(EchoFormsOutputControl, _super);

      function EchoFormsOutputControl() {
        _ref2 = EchoFormsOutputControl.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      EchoFormsOutputControl.selector = '.echoforms-control-output';

      EchoFormsOutputControl.prototype.inputs = function() {
        return $();
      };

      EchoFormsOutputControl.prototype.getValue = function() {
        return this.el.find('.elements > a, .elements p').text();
      };

      EchoFormsOutputControl.prototype.setValue = function(value) {
        var outputEl;
        outputEl = this.el.find('.elements > a, .elements p');
        if (outputEl.is('a')) {
          outputEl.attr('href', value);
        }
        return outputEl.text(value);
      };

      return EchoFormsOutputControl;

    })(BaseEchoFormsControl);
    EchoFormsDefaultControl = (function(_super) {
      __extends(EchoFormsDefaultControl, _super);

      function EchoFormsDefaultControl() {
        _ref3 = EchoFormsDefaultControl.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      EchoFormsDefaultControl.selector = '.echoforms-control';

      EchoFormsDefaultControl.prototype.getValue = function() {
        return this.inputs().val();
      };

      EchoFormsDefaultControl.prototype.setValue = function(value) {
        return this.inputs().val(value);
      };

      return EchoFormsDefaultControl;

    })(BaseEchoFormsControl);
    BaseEchoFormsConstraint = (function() {
      function BaseEchoFormsConstraint(attrs) {
        this.attrs = attrs;
      }

      BaseEchoFormsConstraint.prototype.message = function() {
        return this.attrs.alert;
      };

      return BaseEchoFormsConstraint;

    })();
    EchoFormsInterface = (function() {
      EchoFormsInterface.inputTimeout = null;

      function EchoFormsInterface(root, options) {
        this.root = root;
        this._onSubmit = __bind(this._onSubmit, this);
        this._onControlChange = __bind(this._onControlChange, this);
        this.options = $.extend({}, defaults, options);
        this.controlClasses = this.options['controls'].concat(defaultControls);
        this._defaults = defaults;
        this._name = pluginName;
        this.root = root = $(root);
        root.data('echoformsInterface', this);
        root.bind('echoforms:refresh', this.waitThenRefresh);
        root.submit(this._onSubmit);
        root.closest('form#form-test').submit(this._onSubmit);
        this.instance = new EchoForm(root.find('.echoforms-model').text());
        this.initializeInstance(root);
      }

      EchoFormsInterface.prototype.initializeInstance = function(localRoot, refresh) {
        var controls, self;
        this.refresh();
        self = this;
        controls = localRoot.find('.echoforms-control');
        controls.each(function() {
          var ControlClass, el, _i, _len, _ref4, _results;
          el = $(this);
          if (!el.data('echoformsControl')) {
            _ref4 = self.controlClasses;
            _results = [];
            for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
              ControlClass = _ref4[_i];
              if (el.is(ControlClass.selector)) {
                if (isFunction(ControlClass)) {
                  el.data('echoformsControl', new ControlClass(el));
                } else {
                  el.data('echoformsControl', new Object(ControlClass));
                }
                break;
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        });
        controls.bind('echoforms:controlchange', this._onControlChange);
        return this.root.trigger('echoforms:instanceInitialized', localRoot);
      };

      EchoFormsInterface.prototype._onControlChange = function(e, el, control, newValue) {
        var context;
        context = this.instanceContext(el);
        this.instance.update(context, el.data('echoformsRef'), null, newValue);
        el.addClass('echoforms-updating');
        return this.waitThenRefresh();
      };

      EchoFormsInterface.prototype._waitThenRefresh = function() {
        var timeoutfn;
        clearTimeout(EchoFormInterface.inputTimeout);
        timeoutfn = "$('.echoform:visible').each(function() {" + "   $(this).data('echoformsUi').refresh();" + "});";
        return EchoFormInterface.inputTimeout = setTimeout(timeoutfn, 500);
      };

      EchoFormsInterface.prototype._onSubmit = function(e) {
        var instance, message, self;
        this.refresh();
        if (this.root.hasClass('echoforms-invalid')) {
          message = 'Please correct errors identified in bold before ' + 'submitting the form';
          this.root.find('.echoforms-alert').text(message).show();
          e.preventDefault();
          return false;
        } else {
          instance = new EchoForm(this.instance.serialize());
          self = this;
          this.root.find('.echoforms-irrelevant').each(function() {
            var el;
            el = $(this);
            return this.instance.prune(self.instanceContext(el), el.data('echoformsRef'));
          });
          this.root.find('.model').val(this.instance.serialize());
          return this.instance = instance;
        }
      };

      EchoFormsInterface.prototype.refresh = function() {
        var self;
        this.root.trigger('echoforms:beforerefresh', this);
        self = this;
        this.root.find('.echoforms-control').each(function() {
          var control, el, isReadonly, isRelevant;
          el = $(this);
          control = $(this).data('echoformsControl');
          if (control != null) {
            control.value(self.instanceValue(el, 'echoformsRef'));
            isRelevant = this.instanceValue(el, 'echoformsRelevant', {
              "default": true
            });
            control.relevant(isRelevant);
            isReadonly = this.instanceValue(el, 'echoformsReadonly', {
              "default": false
            });
            return control.readonly(isReadonly);
          }
        });
        return this.root.trigger('echoforms:refresh', this);
      };

      EchoFormsInterface.prototype.validate = function() {
        return console.log("TODO: Validations");
      };

      EchoFormsInterface.prototype.instanceContext = function(el) {
        var refParent;
        refParent = el.parentsUntil('echoform', '[data-echoforms-ref]').first();
        if (refParent.length > 0) {
          return this.instanceXPath(refParent, 'echoformsRef')[0];
        } else {
          return this.instance.root;
        }
      };

      EchoFormsInterface.prototype.instanceXPath = function(el, xpathAttr) {
        var context, xpath;
        xpath = el.data(xpathAttr);
        if (xpath == null) {
          return null;
        }
        context = this.instanceContext(el);
        return this.instance.find(context, xpath);
      };

      EchoFormsInterface.prototype.instanceValue = function(el, xpathAttr, options) {
        var result;
        if (options == null) {
          options = {};
        }
        result = this.instanceXPath(el, xpathAttr);
        if (result instanceof Array) {
          result = result[0].getValues(el.data('echoformsValueElementName'));
        }
        return result != null ? result : options['default'];
      };

      return EchoFormsInterface;

    })();
    $.fn[pluginName] = function(options) {
      this.each(function() {});
      if (!$.data(this, "echoformsInterface")) {
        return $.data(this, "echoformsInterface", new EchoFormsInterface(this, options));
      }
    };
    return $(document).ready(function() {
      var formatXml;
      formatXml = function(xml) {
        return xml.replace(/\s+/g, ' ').replace(/> </g, '>\n<');
      };
      return $(document).bind('echoforms:instanceChange', function(event, instance) {
        return $('#debug').text(formatXml(instance.serialize()));
      });
    });
  })(jQuery, window, document);

}).call(this);
