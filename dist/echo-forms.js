(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var BaseConstraint, BaseControl, CheckboxControl, ControlrefControl, EchoForm, EchoFormsBuilder, EchoFormsInterface, FormControl, GroupControl, GroupingControl, InputControl, ItemCountConstraint, MaxItemsConstraint, MinItemsConstraint, OutputControl, PatternConstraint, RangeControl, ReferenceControl, RepeatControl, RepeatInstanceControl, RepeatTemplateControl, RequiredConstraint, SecretControl, SelectControl, SelectrefControl, TextareaControl, TypeConstraint, TypedControl, UrlOutputControl, XPathConstraint, XPathResolver, defaultControls, defaults, echoformsControlUniqueId, isFunction, nearest, pluginName, _base, _ref, _ref1, _ref10, _ref11, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
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
    BaseConstraint = (function() {
      function BaseConstraint(message) {
        this.message = message;
      }

      return BaseConstraint;

    })();
    PatternConstraint = (function(_super) {
      __extends(PatternConstraint, _super);

      function PatternConstraint(pattern, message) {
        this.pattern = pattern;
        PatternConstraint.__super__.constructor.call(this, message != null ? message : 'Invalid');
      }

      return PatternConstraint;

    })(BaseConstraint);
    XPathConstraint = (function(_super) {
      __extends(XPathConstraint, _super);

      function XPathConstraint(xpath, message) {
        this.xpath = xpath;
        XPathConstraint.__super__.constructor.call(this, message != null ? message : 'Invalid');
      }

      return XPathConstraint;

    })(BaseConstraint);
    TypeConstraint = (function(_super) {
      __extends(TypeConstraint, _super);

      function TypeConstraint(type, message) {
        this.type = type;
        if (message == null) {
          message = null;
        }
        TypeConstraint.__super__.constructor.call(this, message != null ? message : "Value must be a " + this.type);
      }

      return TypeConstraint;

    })(BaseConstraint);
    RequiredConstraint = (function(_super) {
      __extends(RequiredConstraint, _super);

      function RequiredConstraint(xpath, message) {
        this.xpath = xpath;
        if (message == null) {
          message = "Required field";
        }
        RequiredConstraint.__super__.constructor.call(this, message);
      }

      return RequiredConstraint;

    })(BaseConstraint);
    ItemCountConstraint = (function(_super) {
      __extends(ItemCountConstraint, _super);

      function ItemCountConstraint(count, message) {
        this.count = count;
        if (message == null) {
          message = null;
        }
        ItemCountConstraint.__super__.constructor.call(this, message != null ? message : this.buildMessage());
      }

      ItemCountConstraint.prototype.itemWord = function() {
        if (this.count === 1) {
          return "item";
        } else {
          return "items";
        }
      };

      return ItemCountConstraint;

    })(BaseConstraint);
    MinItemsConstraint = (function(_super) {
      __extends(MinItemsConstraint, _super);

      function MinItemsConstraint() {
        _ref = MinItemsConstraint.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      MinItemsConstraint.prototype.buildMessage = function() {
        return "At least " + this.count + " " + (this.itemWord()) + " required";
      };

      return MinItemsConstraint;

    })(ItemCountConstraint);
    MaxItemsConstraint = (function(_super) {
      __extends(MaxItemsConstraint, _super);

      function MaxItemsConstraint() {
        _ref1 = MaxItemsConstraint.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      MaxItemsConstraint.prototype.buildMessage = function() {
        return "No more than " + this.count + " " + (this.itemWord()) + " allowed";
      };

      return MaxItemsConstraint;

    })(ItemCountConstraint);
    echoformsControlUniqueId = 0;
    BaseControl = (function() {
      function BaseControl(ui, model, controlClasses, resolver) {
        var help, _i, _len, _ref2, _ref3;
        this.ui = ui;
        this.model = model;
        this.controlClasses = controlClasses;
        this.resolver = resolver;
        this.onChange = __bind(this.onChange, this);
        this.changed = __bind(this.changed, this);
        this.refExpr = ui.attr('ref');
        this.id = (_ref2 = ui.attr('id')) != null ? _ref2 : "echoforms-control-" + (echoformsControlUniqueId++);
        this.relevantExpr = ui.attr('relevant');
        this.requiredExpr = ui.attr('required');
        this.readonlyExpr = ui.attr('readonly');
        this.label = ui.attr('label');
        _ref3 = ui.children('help');
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          help = _ref3[_i];
          this.help = $(help).text();
        }
        this.loadConstraints();
        this.el = this.buildDom();
        this.bindEvents();
      }

      BaseControl.prototype.loadConstraints = function() {
        var constraintNodes, message, node, patternNode, xpathNode, _i, _len, _ref2, _results;
        this.constraints = [];
        if (this.requiredExpr) {
          this.constraints.push(new RequiredConstraint(this.requiredExpr));
        }
        constraintNodes = this.ui.children('constraints');
        _ref2 = constraintNodes.children('constraint');
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          node = _ref2[_i];
          node = $(node);
          message = node.children('alert').text();
          patternNode = node.children('pattern');
          xpathNode = node.children('xpath');
          if (patternNode.length > 0) {
            this.constraints.push(new PatternConstraint(patternNode.text(), message));
          }
          if (xpathNode.length > 0) {
            _results.push(this.constraints.push(new XPathConstraint(xpathNode.text(), message)));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      BaseControl.prototype.isRelevant = function() {
        if (this.relevantExpr != null) {
          return this.xpath(this.relevantExpr);
        } else {
          return true;
        }
      };

      BaseControl.prototype.isRequired = function() {
        if (this.requiredExpr != null) {
          return this.xpath(this.requiredExpr);
        } else {
          return false;
        }
      };

      BaseControl.prototype.isReadonly = function() {
        if (this.readonlyExpr != null) {
          return this.xpath(this.readonlyExpr);
        } else {
          return false;
        }
      };

      BaseControl.prototype.ref = function() {
        if (this.refExpr != null) {
          return this.xpath(this.refExpr);
        } else {
          return this.model;
        }
      };

      BaseControl.prototype.refValue = function() {
        if (this.refExpr != null) {
          return this.ref().text().trim();
        } else {
          return "";
        }
      };

      BaseControl.prototype.inputValue = function() {
        return console.warn("" + this.constructor.name + " must override inputValue");
      };

      BaseControl.prototype.loadFromModel = function() {
        return console.warn("" + this.constructor.name + " must override loadFromModel");
      };

      BaseControl.prototype.saveToModel = function() {
        return console.warn("" + this.constructor.name + " must override saveToModel");
      };

      BaseControl.prototype.bindEvents = function() {};

      BaseControl.prototype.xpath = function(xpath) {
        return this.model.xpath(xpath, this.resolver);
      };

      BaseControl.prototype.element = function() {
        return this.el != null ? this.el : this.el = this.buildDom();
      };

      BaseControl.prototype.isChanged = function(newValue) {
        return this.refValue().toString().trim() !== this.inputValue().toString().trim();
      };

      BaseControl.prototype.changed = function() {
        console.log('triggering on', this.el);
        return this.el.trigger('echoforms:modelchange');
      };

      BaseControl.prototype.inputSelector = ':input';

      BaseControl.prototype.inputs = function() {
        return this._inputs != null ? this._inputs : this._inputs = this.el.find(this.inputSelector);
      };

      BaseControl.prototype.relevant = function(arg) {
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

      BaseControl.prototype.readonly = function(arg) {
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

      BaseControl.prototype.updateReadonly = function(isReadonly) {
        this.inputs().attr('disabled', isReadonly);
        return this.inputs().attr('readonly', isReadonly);
      };

      BaseControl.prototype.value = function(arg) {
        if (arg != null) {
          if (this.isChanged()) {
            this.setValue(arg);
            return this.changed(arg);
          }
        } else {
          return this.getValue();
        }
      };

      BaseControl.prototype.onChange = function(e) {
        if (this.isChanged()) {
          this.saveToModel();
          return this.changed();
        }
      };

      BaseControl.prototype.buildLabelDom = function() {
        if (this.label != null) {
          return $("<label class=\"echoforms-control-label\" for=\"" + this.id + "-element\">" + this.label + "</label>");
        } else {
          return $();
        }
      };

      BaseControl.prototype.buildHelpDom = function() {
        var help, result, _i, _len, _ref2;
        result = $();
        _ref2 = this.ui.children('help');
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          help = _ref2[_i];
          result = result.add("<label class=\"echoforms-help\" for=\"" + this.id + "-element\">" + ($(help).text()) + "</label>");
        }
        return result;
      };

      BaseControl.prototype.buildControlDom = function() {
        return $("<div id=\"" + this.id + "\" class=\"echoforms-control echoforms-control-" + this.ui[0].nodeName + "\"/>");
      };

      BaseControl.prototype.buildElementsDom = function() {
        return $('<div class="echoforms-elements"/>').append(this.buildElementsChildrenDom());
      };

      BaseControl.prototype.buildElementsChildrenDom = function() {
        return $();
      };

      BaseControl.prototype.buildDom = function() {
        var root;
        root = this.buildControlDom();
        root.append(this.buildLabelDom());
        root.append(this.buildElementsDom());
        root.append(this.buildHelpDom());
        return root;
      };

      return BaseControl;

    })();
    TypedControl = (function(_super) {
      __extends(TypedControl, _super);

      function TypedControl(ui, model, controlClasses, resolver) {
        var _ref2;
        this.inputType = ((_ref2 = ui.attr('inputType')) != null ? _ref2 : 'string').replace(/^.*:/, '').toLowerCase();
        TypedControl.__super__.constructor.call(this, ui, model, controlClasses, resolver);
      }

      TypedControl.prototype.loadConstraints = function() {
        TypedControl.__super__.loadConstraints.call(this);
        return this.constraints.push(new TypeConstraint(this.inputType));
      };

      TypedControl.prototype.bindEvents = function() {
        return this.inputs().bind('click change', this.onChange);
      };

      TypedControl.prototype.inputValue = function() {
        return this.inputs().val();
      };

      TypedControl.prototype.saveToModel = function() {
        return this.ref().text(this.inputValue());
      };

      TypedControl.prototype.loadFromModel = function() {
        return this.inputs().val(this.refValue());
      };

      TypedControl.prototype.getValue = function() {
        return this.inputs().val();
      };

      TypedControl.prototype.setValue = function(value) {
        return this.inputs().val(value);
      };

      return TypedControl;

    })(BaseControl);
    InputControl = (function(_super) {
      __extends(InputControl, _super);

      function InputControl() {
        _ref2 = InputControl.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      InputControl.selector = 'input';

      InputControl.prototype.buildElementsChildrenDom = function() {
        var element;
        element = $("<input id=\"" + this.id + "-element\" type=\"text\" class=\"echoforms-element-input echoforms-element-input-" + this.inputType + "\" autocomplete=\"off\">");
        if (this.inputType === 'datetime') {
          element.attr('placeholder', 'MM/DD/YYYY HH:MM:SS');
        }
        return element;
      };

      return InputControl;

    })(TypedControl);
    CheckboxControl = (function(_super) {
      __extends(CheckboxControl, _super);

      function CheckboxControl() {
        _ref3 = CheckboxControl.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      CheckboxControl.selector = 'input[type$=boolean]';

      CheckboxControl.prototype.inputSelector = ':checkbox';

      CheckboxControl.prototype.loadFromModel = function() {
        return this.inputs().attr('checked', this.refValue().toString().trim() === 'true');
      };

      CheckboxControl.prototype.getValue = function() {
        return this.inputs().is(':checked');
      };

      CheckboxControl.prototype.setValue = function(value) {
        return this.inputs().attr('checked', value.toString().trim() === 'true');
      };

      CheckboxControl.prototype.buildElementsChildrenDom = function() {
        return CheckboxControl.__super__.buildElementsChildrenDom.call(this).attr('type', 'checkbox');
      };

      return CheckboxControl;

    })(InputControl);
    OutputControl = (function(_super) {
      __extends(OutputControl, _super);

      OutputControl.selector = 'output';

      function OutputControl(ui, model, controlClasses, resolver) {
        this.valueExpr = ui.attr('value');
        OutputControl.__super__.constructor.call(this, ui, model, controlClasses, resolver);
      }

      OutputControl.prototype.inputs = function() {
        return $();
      };

      OutputControl.prototype.getValue = function() {
        return this.el.find('.echoforms-elements > p').text();
      };

      OutputControl.prototype.setValue = function(value) {
        return this.el.find('.echoforms-elements > p').text(value);
      };

      OutputControl.prototype.buildElementsChildrenDom = function() {
        return $('<p/>');
      };

      return OutputControl;

    })(TypedControl);
    UrlOutputControl = (function(_super) {
      __extends(UrlOutputControl, _super);

      function UrlOutputControl() {
        _ref4 = UrlOutputControl.__super__.constructor.apply(this, arguments);
        return _ref4;
      }

      UrlOutputControl.selector = 'input[type$=anyURI], input[type$=anyuri]';

      UrlOutputControl.prototype.getValue = function() {
        return this.el.find('.echoforms-elements > a').text();
      };

      UrlOutputControl.prototype.setValue = function(value) {
        return this.el.find('.echoforms-elements > a').text(value).attr('href', value);
      };

      UrlOutputControl.prototype.buildElementsChildrenDom = function() {
        return $('<a href="#" />');
      };

      return UrlOutputControl;

    })(OutputControl);
    SelectControl = (function(_super) {
      __extends(SelectControl, _super);

      SelectControl.selector = 'select';

      function SelectControl(ui, model, controlClasses, resolver) {
        var item, label, value;
        this.isOpen = ui.attr('open') === 'true';
        this.isMultiple = ui.attr('multiple') === 'true';
        this.valueElementName = ui.attr('valueElementName');
        this.items = (function() {
          var _i, _len, _ref5, _ref6, _results;
          _ref5 = ui.children('item');
          _results = [];
          for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
            item = _ref5[_i];
            _ref6 = [$(item).attr('label'), $(item).attr('value')], label = _ref6[0], value = _ref6[1];
            _results.push([label != null ? label : value, value]);
          }
          return _results;
        })();
        SelectControl.__super__.constructor.call(this, ui, model, controlClasses, resolver);
      }

      SelectControl.prototype.buildElementsChildrenDom = function() {
        var el, label, value, _i, _len, _ref5, _ref6, _results;
        el = $("<select id=\"" + this.id + "-element\" class=\"echoforms-element-select\" autocomplete=\"off\"/>");
        if (this.isMultiple) {
          el.addClass('echoforms-element-select-multiple');
          el.attr('multiple', 'multiple');
        } else {
          el.append('<option value=""> -- Select a value -- </option>');
        }
        if (this.isOpen) {
          el.addClass('echoforms-element-select-open');
        }
        _ref5 = this.items;
        _results = [];
        for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
          _ref6 = _ref5[_i], label = _ref6[0], value = _ref6[1];
          _results.push(el.append("<option value=\"" + value + "\">" + label + "</option>"));
        }
        return _results;
      };

      return SelectControl;

    })(TypedControl);
    RangeControl = (function(_super) {
      __extends(RangeControl, _super);

      RangeControl.selector = 'range';

      function RangeControl(ui, model, controlClasses, resolver) {
        this.start = ui.attr('start');
        this.end = ui.attr('end');
        this.step = ui.attr('step');
        RangeControl.__super__.constructor.call(this, ui, model, controlClasses, resolver);
      }

      return RangeControl;

    })(InputControl);
    SecretControl = (function(_super) {
      __extends(SecretControl, _super);

      function SecretControl() {
        _ref5 = SecretControl.__super__.constructor.apply(this, arguments);
        return _ref5;
      }

      SecretControl.selector = 'secret';

      SecretControl.prototype.buildElementsChildrenDom = function() {
        return SecretControl.__super__.buildElementsChildrenDom.call(this).attr('type', 'password');
      };

      return SecretControl;

    })(InputControl);
    TextareaControl = (function(_super) {
      __extends(TextareaControl, _super);

      function TextareaControl() {
        _ref6 = TextareaControl.__super__.constructor.apply(this, arguments);
        return _ref6;
      }

      TextareaControl.selector = 'textarea';

      TextareaControl.prototype.buildElementsChildrenDom = function() {
        return $("<textarea id=\"" + this.id + "-element\" class=\"echoforms-element-textarea\" autocomplete=\"off\"/>");
      };

      return TextareaControl;

    })(TypedControl);
    GroupingControl = (function(_super) {
      __extends(GroupingControl, _super);

      function GroupingControl() {
        _ref7 = GroupingControl.__super__.constructor.apply(this, arguments);
        return _ref7;
      }

      GroupingControl.prototype.inputs = function() {
        return $();
      };

      GroupingControl.prototype.getValue = function() {
        var ui;
        if (this.el.data('echoformsRef')) {
          ui = this.el.closest('.echoforms-echoform').data('echoformsInterface');
          return ui.instanceValue(this.el, 'echoformsRef');
        }
      };

      GroupingControl.prototype.loadFromModel = function() {
        var control, _i, _len, _ref8, _results;
        _ref8 = this.controls;
        _results = [];
        for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
          control = _ref8[_i];
          _results.push(control.loadFromModel());
        }
        return _results;
      };

      GroupingControl.prototype.buildDom = function() {
        var ControlClass, child, childModel, children, control, controls, found, root, ui, _i, _j, _len, _len1, _ref8, _ref9;
        root = GroupingControl.__super__.buildDom.apply(this, arguments);
        childModel = this.ref();
        ui = this.ui;
        children = $();
        this.controls = controls = [];
        _ref8 = ui.children();
        for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
          child = _ref8[_i];
          if (child.nodeName === 'help') {
            continue;
          }
          found = false;
          _ref9 = this.controlClasses;
          for (_j = 0, _len1 = _ref9.length; _j < _len1; _j++) {
            ControlClass = _ref9[_j];
            if ($(child).is(ControlClass.selector)) {
              control = new ControlClass($(child), childModel, this.controlClasses, this.resolver);
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

      return GroupingControl;

    })(BaseControl);
    FormControl = (function(_super) {
      __extends(FormControl, _super);

      function FormControl(ui, model, controlClasses, resolver) {
        ui.attr('ref', model.children()[0].nodeName);
        FormControl.__super__.constructor.call(this, ui, model, controlClasses, resolver);
        this.loadFromModel();
      }

      FormControl.prototype.bindEvents = function() {
        var _this = this;
        return this.el.on('echoforms:modelchange', '.echoforms-control', function() {
          return _this.loadFromModel();
        });
      };

      return FormControl;

    })(GroupingControl);
    GroupControl = (function(_super) {
      __extends(GroupControl, _super);

      function GroupControl() {
        _ref8 = GroupControl.__super__.constructor.apply(this, arguments);
        return _ref8;
      }

      GroupControl.selector = 'group';

      return GroupControl;

    })(GroupingControl);
    RepeatInstanceControl = (function(_super) {
      __extends(RepeatInstanceControl, _super);

      function RepeatInstanceControl() {
        _ref9 = RepeatInstanceControl.__super__.constructor.apply(this, arguments);
        return _ref9;
      }

      return RepeatInstanceControl;

    })(GroupingControl);
    RepeatTemplateControl = (function(_super) {
      __extends(RepeatTemplateControl, _super);

      function RepeatTemplateControl() {
        _ref10 = RepeatTemplateControl.__super__.constructor.apply(this, arguments);
        return _ref10;
      }

      RepeatTemplateControl.selector = 'template';

      RepeatTemplateControl.prototype.buildDom = function() {
        return $();
      };

      RepeatTemplateControl.prototype.loadFromModel = function() {};

      return RepeatTemplateControl;

    })(GroupingControl);
    RepeatControl = (function(_super) {
      __extends(RepeatControl, _super);

      RepeatControl.selector = 'repeat';

      function RepeatControl(ui, model, controlClasses, resolver) {
        this.minItems = ui.attr('minItems');
        if (this.minItems) {
          this.minItems = parseInt(this.minItems, 10);
        }
        this.maxItems = ui.attr('maxItems');
        if (this.maxItems) {
          this.maxItems = parseInt(this.maxItems, 10);
        }
        RepeatControl.__super__.constructor.call(this, ui, model, controlClasses, resolver);
      }

      RepeatControl.prototype.loadConstraints = function() {
        RepeatControl.__super__.loadConstraints.call(this);
        if (this.minItems != null) {
          this.constraints.push(new MinItemsConstraint(this.minItems));
        }
        if (this.maxItems != null) {
          return this.constraints.push(new MaxItemsConstraint(this.maxItems));
        }
      };

      return RepeatControl;

    })(GroupingControl);
    ReferenceControl = (function(_super) {
      __extends(ReferenceControl, _super);

      function ReferenceControl(ui, model, controlClasses, resolver) {
        this.idref = ui.attr('idref');
        ReferenceControl.__super__.constructor.call(this, ui, model, controlClasses, resolver);
      }

      return ReferenceControl;

    })(BaseControl);
    ControlrefControl = (function(_super) {
      __extends(ControlrefControl, _super);

      function ControlrefControl() {
        _ref11 = ControlrefControl.__super__.constructor.apply(this, arguments);
        return _ref11;
      }

      ControlrefControl.selector = 'controlref';

      return ControlrefControl;

    })(ReferenceControl);
    SelectrefControl = (function(_super) {
      __extends(SelectrefControl, _super);

      SelectrefControl.selector = 'selectref';

      function SelectrefControl(ui, model, controlClasses) {
        var item, label, value;
        this.isOpen = ui.attr('open') === 'true';
        this.isMultiple = ui.attr('multiple') === 'true';
        this.valueElementName = ui.attr('valueElementName');
        this.items = (function() {
          var _i, _len, _ref12, _ref13, _results;
          _ref12 = ui.children('item');
          _results = [];
          for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
            item = _ref12[_i];
            _ref13 = [$(item).attr('label'), $(item).attr('value')], label = _ref13[0], value = _ref13[1];
            _results.push([label != null ? label : value, value]);
          }
          return _results;
        })();
      }

      return SelectrefControl;

    })(ReferenceControl);
    defaultControls = [CheckboxControl, InputControl, UrlOutputControl, OutputControl, SelectControl, RangeControl, SecretControl, TextareaControl, GroupControl, RepeatControl, RepeatTemplateControl, ControlrefControl, SelectrefControl];
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
    XPathResolver = (function() {
      function XPathResolver(xml) {
        this.resolve = __bind(this.resolve, this);
        var match, name, namespaceRegexp, namespaces, uri, _ref12;
        namespaces = {};
        namespaceRegexp = /\sxmlns(?::(\w+))?=\"([^\"]+)\"/g;
        match = namespaceRegexp.exec(xml);
        while (match != null) {
          name = (_ref12 = match[1]) != null ? _ref12 : ' default ';
          uri = match[2];
          namespaces[name] = uri;
          match = namespaceRegexp.exec(xml);
        }
        namespaces['xs'] = 'http://www.w3.org/2001/XMLSchema';
        namespaces['echoforms'] = 'http://echo.nasa.gov/v9/echoforms';
        this.namespaces = namespaces;
      }

      XPathResolver.prototype.resolve = function(prefix) {
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

      return XPathResolver;

    })();
    EchoFormsBuilder = (function() {
      EchoFormsBuilder.uniqueId = 0;

      function EchoFormsBuilder(xml, controlClasses) {
        var doc, model, ui;
        this.controlClasses = controlClasses;
        this.resolver = new XPathResolver(xml).resolve;
        doc = $($.parseXML(xml));
        this.model = model = doc.xpath('//echoforms:form/echoforms:model/echoforms:instance', this.resolver);
        this.ui = ui = doc.xpath('//echoforms:form/echoforms:ui', this.resolver);
        window.ui = ui;
        window.model = model;
        window.resolver = this.resolver;
        this.control = new FormControl(ui, model, this.controlClasses, this.resolver);
      }

      EchoFormsBuilder.prototype.element = function() {
        return this.control.element();
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
        this.builder = new EchoFormsBuilder(root.find('.echoforms-xml').text(), this.controlClasses);
        root.append(this.builder.element());
      }

      EchoFormsInterface.prototype.initializeInstance = function(localRoot, refresh) {
        var controls, self;
        this.refresh();
        self = this;
        controls = localRoot.find('.echoforms-control');
        controls.each(function() {
          var ControlClass, el, _i, _len, _ref12, _results;
          el = $(this);
          if (!el.data('echoformsControl')) {
            _ref12 = self.controlClasses;
            _results = [];
            for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
              ControlClass = _ref12[_i];
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
