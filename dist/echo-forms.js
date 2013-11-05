(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var BaseConstraint, BaseControl, CheckboxControl, ControlrefControl, EchoFormsBuilder, EchoFormsInterface, FormControl, GroupControl, GroupingControl, InputControl, ItemCountConstraint, MaxItemsConstraint, MinItemsConstraint, OutputControl, PatternConstraint, RangeControl, ReferenceControl, RepeatControl, RepeatInstanceControl, RepeatTemplateControl, RequiredConstraint, SecretControl, SelectControl, SelectrefControl, TextareaControl, TypeConstraint, TypedControl, UrlOutputControl, XPathConstraint, XPathResolver, defaultControls, defaults, echoformsControlUniqueId, pluginName, _ref, _ref1, _ref10, _ref11, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    BaseConstraint = (function() {
      function BaseConstraint(message) {
        this.message = message;
      }

      BaseConstraint.prototype.check = function(value, model, resolver) {
        return console.warn("" + this.constructor.name + " must override check");
      };

      return BaseConstraint;

    })();
    PatternConstraint = (function(_super) {
      __extends(PatternConstraint, _super);

      function PatternConstraint(patternStr, message) {
        this.pattern = new RegExp('^' + patternStr + '$');
        PatternConstraint.__super__.constructor.call(this, message != null ? message : 'Invalid');
      }

      PatternConstraint.prototype.check = function(value, model, resolver) {
        return !value || this.pattern.exec(value) !== null;
      };

      return PatternConstraint;

    })(BaseConstraint);
    XPathConstraint = (function(_super) {
      __extends(XPathConstraint, _super);

      function XPathConstraint(xpath, message) {
        this.xpath = xpath;
        XPathConstraint.__super__.constructor.call(this, message != null ? message : 'Invalid');
      }

      XPathConstraint.prototype.check = function(value, model, resolver) {
        return model.xpath(this.xpath, resolver)[0];
      };

      return XPathConstraint;

    })(BaseConstraint);
    TypeConstraint = (function(_super) {
      __extends(TypeConstraint, _super);

      TypeConstraint.MIN_SHORT = -Math.pow(2, 15);

      TypeConstraint.MAX_SHORT = Math.pow(2, 15) - 1;

      TypeConstraint.MIN_INT = -Math.pow(2, 31);

      TypeConstraint.MAX_INT = Math.pow(2, 31) - 1;

      TypeConstraint.MIN_LONG = -Math.pow(2, 63);

      TypeConstraint.MAX_LONG = Math.pow(2, 63) - 1;

      function TypeConstraint(rawType, message) {
        var a, human_type, match;
        if (message == null) {
          message = null;
        }
        match = rawType.match(/^(?:[^:]+:)?(.*)$/);
        this.type = match ? match[1] : rawType;
        human_type = (function() {
          switch (this.type) {
            case "double":
              return "number";
            case "long":
              return "integer between -2^63 and 2^63-1";
            case "int":
              return "integer between -2,147,483,648 and 2,147,483,647";
            case "short":
              return "integer between -32,768 and 32,767";
            case "datetime":
              return "date/time with format MM/DD/YYYYTHH:MM:SS";
            case "boolean":
              return "true or false";
            default:
              return this.type;
          }
        }).call(this);
        a = /^[aeiou]/i.test(human_type) ? 'an' : 'a';
        TypeConstraint.__super__.constructor.call(this, message != null ? message : "Value must be " + a + " " + human_type);
      }

      TypeConstraint.prototype.check = function(value, model, resolver) {
        if (!value) {
          return true;
        }
        switch (this.type) {
          case "string":
            return true;
          case "anyuri":
            return true;
          case "double":
            return this.checkDouble(value);
          case "long":
            return this.checkLong(value);
          case "int":
            return this.checkInt(value);
          case "short":
            return this.checkShort(value);
          case "datetime":
            return this.checkDateTime(value);
          case "boolean":
            return this.checkBoolean(value);
          default:
            console.warn("Unable to validate type: ", this.type);
            return true;
        }
      };

      TypeConstraint.prototype._checkIntegerRange = function(min, max, value) {
        var number;
        number = Number(value);
        return !isNaN(number) && number >= min && number <= max && value.indexOf('.') === -1;
      };

      TypeConstraint.prototype.checkDouble = function(value) {
        return !isNaN(Number(value));
      };

      TypeConstraint.prototype.checkLong = function(value) {
        return this._checkIntegerRange(TypeConstraint.MIN_LONG, TypeConstraint.MAX_LONG, value);
      };

      TypeConstraint.prototype.checkInt = function(value) {
        return this._checkIntegerRange(TypeConstraint.MIN_INT, TypeConstraint.MAX_INT, value);
      };

      TypeConstraint.prototype.checkShort = function(value) {
        return this._checkIntegerRange(TypeConstraint.MIN_SHORT, TypeConstraint.MAX_SHORT, value);
      };

      TypeConstraint.prototype.checkBoolean = function(value) {
        return value === 'true' || value === 'false';
      };

      TypeConstraint.prototype.checkDateTime = function(value) {
        console.warn("Implement datetime validation");
        return true;
      };

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

      RequiredConstraint.prototype.check = function(value, model, resolver) {
        return !!value || !model.xpath(this.xpath, resolver)[0];
      };

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

      BaseControl.prototype.ref = function() {
        if (this.refExpr != null) {
          return this.xpath(this.refExpr);
        } else {
          return this.model;
        }
      };

      BaseControl.prototype.refValue = function() {
        if (this.refExpr != null) {
          return $.trim(this.ref().text());
        } else {
          return void 0;
        }
      };

      BaseControl.prototype.inputValue = function() {
        return console.warn("" + this.constructor.name + " must override inputValue");
      };

      BaseControl.prototype.loadFromModel = function() {
        return this.validate();
      };

      BaseControl.prototype.validate = function() {
        var c, errors;
        if (this.relevantExpr != null) {
          this.relevant(!!this.xpath(this.relevantExpr)[0]);
        }
        if (this.readonlyExpr != null) {
          this.readonly(!!this.xpath(this.readonlyExpr)[0]);
        }
        errors = (function() {
          var _i, _len, _ref2, _ref3, _results;
          _ref2 = this.constraints;
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            c = _ref2[_i];
            if (!c.check((_ref3 = this.refValue()) != null ? _ref3 : this.inputValue(), this.model, this.resolver)) {
              _results.push(c.message);
            }
          }
          return _results;
        }).call(this);
        return this.setErrors(errors);
      };

      BaseControl.prototype.saveToModel = function() {};

      BaseControl.prototype.bindEvents = function() {};

      BaseControl.prototype.xpath = function(xpath) {
        if ((xpath != null ? xpath.charAt(0) : void 0) === '[') {
          xpath = "." + xpath;
        }
        return this.model.xpath(xpath, this.resolver);
      };

      BaseControl.prototype.element = function() {
        return this.el != null ? this.el : this.el = this.buildDom();
      };

      BaseControl.prototype.isChanged = function(newValue) {
        return this.refValue() !== this.inputValue() || !this.refExpr;
      };

      BaseControl.prototype.changed = function() {
        return this.el.trigger('echoforms:modelchange');
      };

      BaseControl.prototype.relevant = function(arg) {
        var isRelevant;
        if (arg != null) {
          isRelevant = !!arg;
          if (isRelevant !== this.relevant()) {
            this.el.toggleClass('echoforms-irrelevant', !isRelevant);
            this.el.toggle(isRelevant);
            return this.ref().toggleClass('echoforms-pruned', !isRelevant);
          }
        } else {
          return !this.el.hasClass('echoforms-irrelevant');
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

      BaseControl.prototype.buildErrorsDom = function() {
        return $('<div class="echoforms-errors"/>');
      };

      BaseControl.prototype.setErrors = function(messages) {
        var error, errors, message, _i, _len;
        errors = $();
        for (_i = 0, _len = messages.length; _i < _len; _i++) {
          message = messages[_i];
          error = $('<div class="echoforms-error"/>');
          error.text(message);
          errors = errors.add(error);
        }
        return this.el.find('.echoforms-errors').empty().append(errors);
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
        root.append(this.buildErrorsDom());
        return root;
      };

      return BaseControl;

    })();
    TypedControl = (function(_super) {
      __extends(TypedControl, _super);

      function TypedControl(ui, model, controlClasses, resolver) {
        var _ref2;
        this.inputType = ((_ref2 = ui.attr('type')) != null ? _ref2 : 'string').replace(/^.*:/, '').toLowerCase();
        TypedControl.__super__.constructor.call(this, ui, model, controlClasses, resolver);
      }

      TypedControl.prototype.loadConstraints = function() {
        TypedControl.__super__.loadConstraints.call(this);
        return this.constraints.push(new TypeConstraint(this.inputType));
      };

      TypedControl.prototype.inputs = function() {
        return this._inputs != null ? this._inputs : this._inputs = this.el.find(':input');
      };

      TypedControl.prototype.bindEvents = function() {
        return this.inputs().bind('click change', this.onChange);
      };

      TypedControl.prototype.inputValue = function() {
        return $.trim(this.inputs().val());
      };

      TypedControl.prototype.saveToModel = function() {
        TypedControl.__super__.saveToModel.call(this);
        if (this.refExpr) {
          return this.ref().text(this.inputValue());
        }
      };

      TypedControl.prototype.loadFromModel = function() {
        TypedControl.__super__.loadFromModel.call(this);
        if (this.refExpr) {
          return this.inputs().val(this.refValue());
        }
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
          element.attr('placeholder', 'MM/DD/YYYYTHH:MM:SS');
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

      CheckboxControl.prototype.inputValue = function() {
        return this.inputs().is(':checked').toString();
      };

      CheckboxControl.prototype.loadFromModel = function() {
        CheckboxControl.__super__.loadFromModel.call(this);
        if (this.refExpr) {
          return this.inputs().attr('checked', this.refValue() === 'true');
        }
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

      OutputControl.prototype.loadFromModel = function() {
        OutputControl.__super__.loadFromModel.call(this);
        if (this.refExpr) {
          return this.el.find('.echoforms-elements > p').text(this.refValue());
        }
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

      UrlOutputControl.selector = 'output[type$=anyURI], output[type$=anyuri]';

      UrlOutputControl.prototype.loadFromModel = function() {
        var value;
        value = this.refValue();
        if (this.refExpr) {
          return this.el.find('.echoforms-elements > a').text(value).attr('href', value);
        }
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

      GroupingControl.prototype.loadFromModel = function() {
        var control, _i, _len, _ref8, _results;
        GroupingControl.__super__.loadFromModel.call(this);
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
        var _ref12;
        this.root = root;
        this.options = $.extend({}, defaults, options);
        this.form = (_ref12 = this.options['form']) != null ? _ref12 : root.find('.echoforms-xml').text();
        this.controlClasses = this.options['controls'].concat(defaultControls);
        this._defaults = defaults;
        this._name = pluginName;
        this.root = root = $(root);
        this.builder = new EchoFormsBuilder(this.form, this.controlClasses);
        root.append(this.builder.element());
      }

      return EchoFormsInterface;

    })();
    $.fn[pluginName] = function(options) {
      this.each(function() {});
      if (!$.data(this, "echoformsInterface")) {
        return $.data(this, "echoformsInterface", new EchoFormsInterface(this, options));
      }
    };
    return $(document).ready(function() {});
  })(jQuery, window, document);

}).call(this);
