// Extensions to XNode to make node manipulation simpler

// Removes this node from the DOM
XNode.prototype.remove = function() {
  this.parentNode.removeChild(this);
};

// Removes all child nodes from the DOM
XNode.prototype.clear = function() {
  XNode.removeAll(this.childNodes);
};

// Appends a new element to this node with the given tag name
// and returns the appended tag
XNode.prototype.appendNewElement = function(name) {
  var child = this.ownerDocument.createElement(name);
  this.appendChild(child);
  return child;
};

// Appends text with the given value to this node and returns
// the appended text node.
XNode.prototype.appendText = function(text) {
  var child = this.ownerDocument.createTextNode(text);
  this.appendChild(child);
  return child;
};

// Sets the inner text value for this node
XNode.prototype.setValue = function(value) {
  this.clear();
  this.appendText(value);
};

// Clears existing child nodes with tag name childName,
// then creates a series of new child nodes which have the
// given inner text values.
XNode.prototype.setValues = function(values, tagName) {
  if (!tagName) {
    this.setValue(values);
    return;
  }
  values = values instanceof Array ? values : [values];
  XNode.removeAll(this.getElementsByTagName(tagName));
  for (var i = 0; i < values.length; i++) {
    if (values[i] && values[i].length > 0) {
      this.appendNewElement(tagName).appendText(values[i]);
    }
  }
};

// Returns the inner text of this node
XNode.prototype.getValue = function() {
  return xmlValue(this).trim();
};

// Returns an array of values for each child node with the given name
XNode.prototype.getValues = function(tagName) {
  if(!tagName) {
    return this.getValue();
  }
  var result = [];
  for (var node = this.firstChild; node; node = node.nextSibling) {
    if (node.bareName() == tagName) {
      result.push(node.getValue());
    }
  }
  return result;
};

// Sets the parent node of this node and its descendents
XNode.prototype.reparent = function(newOwner) {
  this.ownerDocument = newOwner;
  for (var node = this.firstChild; node; node = node.nextSibling) {
    node.reparent(newOwner);
  }
};

// Removes the nodes in the given array from the DOM
XNode.removeAll = function(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].remove();
  }
};

XNode.prototype.defaultNamespace = function(parentNamespace) {
  return (this.getAttribute("xmlns") ||
          this.getAttribute("xmlns:xmlns") ||
          parentNamespace ||
          this.parentNode && this.parentNode.defaultNamespace());
};

XNode.prototype.bareName = function() {
  return this.nodeName.match(/^(?:[^:]+:)?(.*)$/)[1];
};

XNode.prototype.getNamespacePrefix = function() {
  return this.nodeName.match(/^(?:([^:]+):)?.*$/)[1];
};

XNode.prototype.setNamespacePrefix = function(prefix) {
  if (prefix) {
    this.nodeName = [prefix, this.bareName()].join(':');
  }
  else {
    this.nodeName = this.bareName();
  }
};

XNode.prototype.namespaces = function() {
  var result = []
  for (var i = 0; i < this.attributes.length; i++) {
    var attribute = this.attributes[i];
    var prefix_match = attribute.nodeName.match(/^xmlns(?::|$)(.*)/);
    if (prefix_match) {
      var prefix = prefix_match[1];
      // Fix IE's use of xmlns:xmlns
      if (prefix == "xmlns") {
        prefix = "";
        attribute.nodeName = "xmlns";
      }
      if (prefix == "") {
        prefix = null;
      }
      result.push({
        prefix: prefix,
        uri: attribute.nodeValue
      });
    }
  }
  return result;
};

XNode.prototype.namespaceUrisToPrefixes = function(parentUrisToPrefixes) {
  if (!parentUrisToPrefixes && this.parentNode) {
    parentUrisToPrefixes = this.parentNode.namespaceUrisToPrefixes();
  }
  var result = $.extend({}, parentUrisToPrefixes);
  var namespaces = this.namespaces();
  for (var i = 0; i < namespaces.length; i++) {
    var ns = namespaces[i];
    if (ns.prefix) {
      result[ns.uri] = ns.prefix;
    }
  }
  return result;
};

XNode.prototype.prefixElements = function(parentNamespace, parentUrisToPrefixes)  {
  if (this.nodeType == DOM_ELEMENT_NODE) {

    var urisToPrefixes = this.namespaceUrisToPrefixes(parentUrisToPrefixes);

    var defaultNs = this.defaultNamespace(parentNamespace);

    if (!this.getNamespacePrefix()) {
      this.setNamespacePrefix(urisToPrefixes[defaultNs]);
    }

    for(var i = 0; i < this.childNodes.length; i++) {
      this.childNodes[i].prefixElements(defaultNs, urisToPrefixes);
    }
  }
}

