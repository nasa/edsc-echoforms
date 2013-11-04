(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($, window, document) {
    var BaseEchoFormsConstraint, BaseEchoFormsControl, EchoForm, EchoFormsBuilder, EchoFormsCheckboxControl, EchoFormsContainerControl, EchoFormsControlrefControl, EchoFormsFormControl, EchoFormsGroupControl, EchoFormsInputControl, EchoFormsInterface, EchoFormsOutputControl, EchoFormsRangeControl, EchoFormsRepeatControl, EchoFormsSecretControl, EchoFormsSelectControl, EchoFormsSelectrefControl, EchoFormsTextareaControl, defaultControls, defaults, echoformsControlUniqueId, isFunction, nearest, pluginName, _base, _ref, _ref1, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
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
    BaseEchoFormsConstraint = (function() {
      function BaseEchoFormsConstraint(attrs) {
        this.attrs = attrs;
      }

      BaseEchoFormsConstraint.prototype.message = function() {
        return this.attrs.alert;
      };

      return BaseEchoFormsConstraint;

    })();
    echoformsControlUniqueId = 0;
    BaseEchoFormsControl = (function() {
      function BaseEchoFormsControl(ui, model, controlClasses) {
        this.ui = ui;
        this.model = model;
        this.controlClasses = controlClasses;
        this.onChange = __bind(this.onChange, this);
        this.changed = __bind(this.changed, this);
        this.refExpr = ui.attr('ref');
        this.relevantExpr = ui.attr('relevant');
        this.requiredExpr = ui.attr('required');
        this.readonlyExpr = ui.attr('readonly');
        this.el = this.buildDom();
        this.inputs().bind('click change', this.onChange);
      }

      BaseEchoFormsControl.prototype.element = function() {
        return this.el != null ? this.el : this.el = this.buildDom();
      };

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
            this.el.toggleClass('echoforms-irrelevant', !isRelevant);
            return this.el.toggle(isRelevant);
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
            this.el.toggleClass('echoforms-readonly ui-state-disabled', isReadonly);
            return this.updateReadonly(isReadonly);
          }
        } else {
          return this.el.hasClass('echoforms-readonly');
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

      BaseEchoFormsControl.prototype.setValue = function() {};

      BaseEchoFormsControl.prototype.onChange = function(e) {
        return this.changed(this.getValue());
      };

      BaseEchoFormsControl.prototype.id = function() {
        return this._id != null ? this._id : this._id = this.ui.attr('id') != null ? this.ui.attr('id') : "echoforms-control-" + (echoformsControlUniqueId++);
      };

      BaseEchoFormsControl.prototype.buildLabelDom = function() {
        var label;
        label = this.ui.attr('label');
        if (label != null) {
          return $("<label class=\"echoforms-control-label\" for=\"" + (this.id()) + "-element\">" + label + "</label>");
        } else {
          return $();
        }
      };

      BaseEchoFormsControl.prototype.buildHelpDom = function() {
        var help, result, _i, _len, _ref;
        result = $();
        _ref = this.ui.children('help');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          help = _ref[_i];
          result = result.add("<label class=\"echoforms-help\" for=\"" + (this.id()) + "-element\">" + ($(help).text()) + "</label>");
        }
        return result;
      };

      BaseEchoFormsControl.prototype.buildControlDom = function() {
        return $("<div id=\"" + (this.id()) + "\" class=\"echoforms-control echoforms-control-" + this.ui[0].nodeName + "\"/>");
      };

      BaseEchoFormsControl.prototype.buildElementsDom = function() {
        return $('<div class="echoforms-elements"/>');
      };

      BaseEchoFormsControl.prototype.buildDom = function() {
        var root;
        root = this.buildControlDom();
        root.append(this.buildLabelDom());
        root.append(this.buildElementsDom());
        root.append(this.buildHelpDom());
        return root;
      };

      return BaseEchoFormsControl;

    })();
    EchoFormsContainerControl = (function(_super) {
      __extends(EchoFormsContainerControl, _super);

      function EchoFormsContainerControl() {
        _ref = EchoFormsContainerControl.__super__.constructor.apply(this, arguments);
        return _ref;
      }

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

      EchoFormsContainerControl.prototype.buildDom = function() {
        var ControlClass, child, children, control, controls, found, model, root, ui, _i, _j, _len, _len1, _ref1, _ref2;
        root = EchoFormsContainerControl.__super__.buildDom.apply(this, arguments);
        model = this.model;
        ui = this.ui;
        children = $();
        this.controls = controls = [];
        _ref1 = ui.children();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          child = _ref1[_i];
          found = false;
          _ref2 = this.controlClasses;
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            ControlClass = _ref2[_j];
            if ($(child).is(ControlClass.selector)) {
              control = new ControlClass($(child), model, this.controlClasses);
              controls.push(control);
              children = children.add(control.el);
              found = true;
              break;
            }
          }
          if (!found) {
            console.log("No class available for element:", child);
          }
        }
        root.find('.echoforms-elements').replaceWith($('<div class="echoforms-children"/>').append(children));
        return root;
      };

      return EchoFormsContainerControl;

    })(BaseEchoFormsControl);
    EchoFormsFormControl = (function(_super) {
      __extends(EchoFormsFormControl, _super);

      function EchoFormsFormControl() {
        _ref1 = EchoFormsFormControl.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      return EchoFormsFormControl;

    })(EchoFormsContainerControl);
    EchoFormsGroupControl = (function(_super) {
      __extends(EchoFormsGroupControl, _super);

      function EchoFormsGroupControl() {
        _ref2 = EchoFormsGroupControl.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      EchoFormsGroupControl.selector = 'group';

      return EchoFormsGroupControl;

    })(EchoFormsContainerControl);
    EchoFormsRepeatControl = (function(_super) {
      __extends(EchoFormsRepeatControl, _super);

      function EchoFormsRepeatControl() {
        _ref3 = EchoFormsRepeatControl.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      EchoFormsRepeatControl.selector = 'repeat';

      return EchoFormsRepeatControl;

    })(EchoFormsContainerControl);
    EchoFormsOutputControl = (function(_super) {
      __extends(EchoFormsOutputControl, _super);

      function EchoFormsOutputControl() {
        _ref4 = EchoFormsOutputControl.__super__.constructor.apply(this, arguments);
        return _ref4;
      }

      EchoFormsOutputControl.selector = 'output';

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
    EchoFormsInputControl = (function(_super) {
      __extends(EchoFormsInputControl, _super);

      function EchoFormsInputControl() {
        _ref5 = EchoFormsInputControl.__super__.constructor.apply(this, arguments);
        return _ref5;
      }

      EchoFormsInputControl.selector = 'input';

      EchoFormsInputControl.prototype.getValue = function() {
        return this.inputs().val();
      };

      EchoFormsInputControl.prototype.setValue = function(value) {
        return this.inputs().val(value);
      };

      EchoFormsInputControl.prototype.inputType = function() {
        return this._inputType != null ? this._inputType : this._inputType = (this.ui.attr('type') != null ? this.ui.attr('type') : '').replace(/^.*:/, '').toLowerCase();
      };

      EchoFormsInputControl.prototype.buildElementsDom = function() {
        var element, inputType;
        inputType = this.inputType();
        element = "<input id=\"" + (this.id()) + "\" type=\"text\" class\"echoforms-element-input echoforms-element-input-" + inputType + "\" autocomplete=\"off\">";
        if (inputType === 'datetime') {
          element.attr('placeholder', 'MM/DD/YYYY HH:MM:SS');
        }
        return EchoFormsInputControl.__super__.buildElementsDom.call(this).append(element);
      };

      return EchoFormsInputControl;

    })(BaseEchoFormsControl);
    EchoFormsCheckboxControl = (function(_super) {
      __extends(EchoFormsCheckboxControl, _super);

      function EchoFormsCheckboxControl() {
        _ref6 = EchoFormsCheckboxControl.__super__.constructor.apply(this, arguments);
        return _ref6;
      }

      EchoFormsCheckboxControl.selector = 'input[type=xsd\\:boolean], input[type=xs\\:boolean]';

      EchoFormsCheckboxControl.prototype.inputSelector = ':checkbox';

      EchoFormsCheckboxControl.prototype.getValue = function() {
        return this.inputs().is(':checked');
      };

      EchoFormsCheckboxControl.prototype.setValue = function(value) {
        return this.inputs().attr('checked', value.toString() === true);
      };

      EchoFormsCheckboxControl.prototype.buildElementsDom = function() {
        var result;
        result = EchoFormsCheckboxControl.__super__.buildElementsDom.call(this);
        result.children('input').attr('type', 'checkbox');
        return result;
      };

      return EchoFormsCheckboxControl;

    })(EchoFormsInputControl);
    EchoFormsSecretControl = (function(_super) {
      __extends(EchoFormsSecretControl, _super);

      function EchoFormsSecretControl() {
        _ref7 = EchoFormsSecretControl.__super__.constructor.apply(this, arguments);
        return _ref7;
      }

      EchoFormsSecretControl.selector = 'secret';

      return EchoFormsSecretControl;

    })(BaseEchoFormsControl);
    EchoFormsTextareaControl = (function(_super) {
      __extends(EchoFormsTextareaControl, _super);

      function EchoFormsTextareaControl() {
        _ref8 = EchoFormsTextareaControl.__super__.constructor.apply(this, arguments);
        return _ref8;
      }

      EchoFormsTextareaControl.selector = 'textarea';

      return EchoFormsTextareaControl;

    })(BaseEchoFormsControl);
    EchoFormsSelectControl = (function(_super) {
      __extends(EchoFormsSelectControl, _super);

      function EchoFormsSelectControl() {
        _ref9 = EchoFormsSelectControl.__super__.constructor.apply(this, arguments);
        return _ref9;
      }

      EchoFormsSelectControl.selector = 'select';

      return EchoFormsSelectControl;

    })(BaseEchoFormsControl);
    EchoFormsControlrefControl = (function(_super) {
      __extends(EchoFormsControlrefControl, _super);

      function EchoFormsControlrefControl() {
        _ref10 = EchoFormsControlrefControl.__super__.constructor.apply(this, arguments);
        return _ref10;
      }

      EchoFormsControlrefControl.selector = 'controlref';

      return EchoFormsControlrefControl;

    })(BaseEchoFormsControl);
    EchoFormsSelectrefControl = (function(_super) {
      __extends(EchoFormsSelectrefControl, _super);

      function EchoFormsSelectrefControl() {
        _ref11 = EchoFormsSelectrefControl.__super__.constructor.apply(this, arguments);
        return _ref11;
      }

      EchoFormsSelectrefControl.selector = 'selectref';

      return EchoFormsSelectrefControl;

    })(BaseEchoFormsControl);
    EchoFormsRangeControl = (function(_super) {
      __extends(EchoFormsRangeControl, _super);

      function EchoFormsRangeControl() {
        _ref12 = EchoFormsRangeControl.__super__.constructor.apply(this, arguments);
        return _ref12;
      }

      EchoFormsRangeControl.selector = 'range';

      return EchoFormsRangeControl;

    })(BaseEchoFormsControl);
    defaultControls = [EchoFormsGroupControl, EchoFormsRepeatControl, EchoFormsOutputControl, EchoFormsSecretControl, EchoFormsTextareaControl, EchoFormsSelectControl, EchoFormsSelectrefControl, EchoFormsControlrefControl, EchoFormsRangeControl, EchoFormsCheckboxControl, EchoFormsInputControl];
    pluginName = "echoform";
    defaults = {
      controls: []
    };
    EchoForm = (function() {
      function EchoForm(xml) {
        this.document = xmlParse(xml);
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
    EchoFormsBuilder = (function() {
      EchoFormsBuilder.uniqueId = 0;

      function EchoFormsBuilder(xml, controlClasses) {
        var doc, model, ui;
        this.controlClasses = controlClasses;
        this.resolver = __bind(this.resolver, this);
        this.loadNamespaces(xml);
        doc = $($.parseXML(xml));
        this.model = model = doc.xpath('//echoforms:form/echoforms:model', this.resolver);
        this.ui = ui = doc.xpath('//echoforms:form/echoforms:ui', this.resolver);
        window.ui = ui;
        this.control = new EchoFormsFormControl(ui, model, this.controlClasses);
      }

      EchoFormsBuilder.prototype.element = function() {
        return this.control.element();
      };

      EchoFormsBuilder.prototype.resolver = function(prefix) {
        var result;
        if (prefix == null) {
          prefix = " default ";
        }
        result = this.namespaces[prefix];
        if (!result) {
          console.log("Bad prefix: " + prefix + ".  Ignoring.");
          prefix = " default ";
        }
        return result;
      };

      EchoFormsBuilder.prototype.loadNamespaces = function(xml) {
        var match, name, namespaceRegexp, namespaces, uri, _ref13;
        namespaces = {};
        namespaceRegexp = /\sxmlns(?::(\w+))?=\"([^\"]+)\"/g;
        match = namespaceRegexp.exec(xml);
        while (match != null) {
          name = (_ref13 = match[1]) != null ? _ref13 : ' default ';
          uri = match[2];
          namespaces[name] = uri;
          match = namespaceRegexp.exec(xml);
        }
        namespaces['xs'] = 'http://www.w3.org/2001/XMLSchema';
        namespaces['echoforms'] = 'http://echo.nasa.gov/v9/echoforms';
        return this.namespaces = namespaces;
      };

      return EchoFormsBuilder;

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
        this.builder = new EchoFormsBuilder(root.find('.echoforms-xml').text(), this.controlClasses);
        root.append(this.builder.element());
        this.instance = new EchoForm(root.find('.echoforms-xml').text());
        this.initializeInstance(root);
      }

      EchoFormsInterface.prototype.initializeInstance = function(localRoot, refresh) {
        var controls, self;
        this.refresh();
        self = this;
        controls = localRoot.find('.echoforms-control');
        controls.each(function() {
          var ControlClass, el, _i, _len, _ref13, _results;
          el = $(this);
          if (!el.data('echoformsControl')) {
            _ref13 = self.controlClasses;
            _results = [];
            for (_i = 0, _len = _ref13.length; _i < _len; _i++) {
              ControlClass = _ref13[_i];
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
