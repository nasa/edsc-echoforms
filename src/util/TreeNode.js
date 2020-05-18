import murmurhash from 'murmurhash'

import { getAttribute } from './getAttribute'
import { getNodeValue } from './getNodeValue'

export class TreeNode {
  constructor(props) {
    this.props = props

    this.level = this.props.level || 0

    this.element = this.props.element
    this.separator = this.props.separator
    this.cascade = this.props.cascade
    this.resolver = this.props.resolver

    this.elementHash = murmurhash.v3(this.element.outerHTML, 'seed')

    this.model = this.props.model
    this.checkedFields = this.props.checkedFields
    this.parentChecked = this.props.parentChecked

    this.disabled = false
    this.allItems = {}
    this.checked = false
    this.children = []
    this.expanded = this.level === 1

    this.value = undefined
    this.originalLabel = undefined
    this.relevantAttribute = undefined
    this.requiredAttribute = undefined
    this.totalLeafNodes = undefined

    this.buildNode(props)

    this.setup = this.setup.bind(this)
    this.setupChildren = this.setupChildren.bind(this)
    this.updateNode = this.updateNode.bind(this)
    this.setExpanded = this.setExpanded.bind(this)
    this.getValue = this.getValue.bind(this)
    this.getLabel = this.getLabel.bind(this)
    this.getRelevant = this.getRelevant.bind(this)
    this.getRequired = this.getRequired.bind(this)
    this.getDisabled = this.getDisabled.bind(this)
    this.getTotalLeafNodes = this.getTotalLeafNodes.bind(this)
    this.getNumberSelectedNodes = this.getNumberSelectedNodes.bind(this)
  }

  /**
   * Builds the properties of the current tree item
   * @param {Object} item
   * @param {Object} item.parent current item's parent item
   */
  buildNode({
    parent = {}
  }) {
    const { attributes, children } = this.element
    this.value = this.getValue(attributes, this.value)
    this.fullValue = this.getFullValue(parent.fullValue, this.value)
    this.id = this.fullValue

    if (this.element.tagName !== 'tree') {
      this.parent = parent

      this.allItems = {
        ...this.allItems,
        [this.fullValue]: this
      }
    }

    this.isLeaf = children.length === 0
    this.isParent = children.length > 0
    this.isChild = parent.fullValue !== ''

    if (children.length) {
      this.setupChildren(children)
    }

    this.setup(attributes)
  }

  /**
   * Sets up node properties based on the XML attributes
   * @param {Object} attributes XML attributes
   */
  setup(attributes) {
    this.relevant = this.getRelevant(attributes)
    this.required = this.getRequired(attributes)
    this.label = this.getLabel(attributes, this.value)
    this.disabled = this.getDisabled()
    this.checked = this.determineChecked(
      this.checkedFields.includes(this.fullValue) || this.required
    )
  }

  /**
   * Sets up the children of the node
   * @param {Object} children HTMLCollection of item children
   */
  setupChildren(children) {
    Array.from(children)
      .filter(child => child.tagName === 'item')
      .forEach((child) => {
        const { attributes: childAttributes } = child

        const childValue = this.getValue(childAttributes)
        const childFullValue = this.getFullValue(this.fullValue, childValue)

        const childNode = new TreeNode({
          ...this.props,
          level: this.level + 1,
          element: child,
          parent: this,
          parentChecked: this.checkedFields.includes(this.fullValue) || this.required || this.parentChecked
        })

        this.allItems = {
          ...this.allItems,
          [childFullValue]: childNode,
          ...childNode.allItems
        }

        this.children.push(childNode)
      })
  }

  /**
   * Updates the node with new values
   * @param {Object} element XML tree item element
   * @param {Object} model XML data model
   * @param {Array} checkedFields Array of checked fullValues
   */
  updateNode(element, model, checkedFields) {
    this.model = model
    this.checkedFields = checkedFields
    const { attributes, children } = element

    if (children.length) {
      this.updateChildren()
    }
    this.setup(attributes)
    return this
  }

  /**
   * Updates the current node's children
   */
  updateChildren() {
    this.children.forEach((child) => {
      child.parentChecked = undefined
      child.updateNode(child, this.model, this.checkedFields)
    })
  }

  /**
   * Seralizes the selected items into an array of the fullValues
   */
  seralize() {
    const checked = []

    Object.keys(this.allItems).forEach((key) => {
      const item = this.allItems[key]
      if (item.element.tagName !== 'tree' && item.checked === true) checked.push(item.fullValue)
    })

    return checked
  }

  /**
   * Determines the total number of leaf nodes in the tree
   */
  getTotalLeafNodes() {
    if (this.totalLeafNodes) return this.totalLeafNodes

    this.totalLeafNodes = Object.values(this.allItems).reduce((total, value) => {
      if (value.isLeaf) return total + 1
      return total
    }, 0)

    return this.totalLeafNodes
  }

  /**
   * Determines how many leaf nodes are checked
   */
  getNumberSelectedNodes() {
    return Object.values(this.allItems).reduce((total, value) => {
      if (value.isLeaf && value.checked) return total + 1
      return total
    }, 0)
  }

  /**
   * Builds the item's fullValue based on the parent
   * @param {String} parentValue parent item's fullValue
   * @param {String} value item value
   */
  getFullValue(parentValue, value) {
    if (!parentValue && value) {
      return `${this.separator}${value}`
    }

    return [parentValue, value].filter(Boolean).join(this.separator)
  }

  /**
   * Determines the checked value based off the item's children
   * @param {String|Boolean} value Checked value (true/false/'indeterminate')
   */
  determineChecked(value) {
    if (!this.relevant) return false

    if ((this.isLeaf || !this.cascade) && value != null) {
      if (this.cascade && this.parent && this.parentChecked === true) {
        return true
      }

      return value
    }

    if (this.allChildrenChecked()) {
      return true
    }

    if (this.someChildrenChecked()) {
      return 'indeterminate'
    }

    return false
  }

  /**
   * Sets the checked property of the item and the item's children if cascading
   * @param {String|Boolean} checked new checked value
   */
  setChecked(checked) {
    let newChecked = checked
    if (this.checked === 'indeterminate') {
      newChecked = true
    }

    this.checked = newChecked || this.required

    if (!this.relevant) this.checked = false

    if (this.cascade) {
      this.children.forEach((child) => {
        child.setChecked(this.checked)
      })
    }
  }

  /**
   * Sets the expanded property of the item
   * @param {Boolean} value new expanded value
   */
  setExpanded(value) {
    this.expanded = value
  }

  /**
   * Determines if all the items children are checked
   */
  allChildrenChecked() {
    return this.children.every(child => child.checked === true)
  }

  /**
   * Determines if none of the items children are checked
   */
  noChildrenChecked() {
    return this.children.every(child => child.checked === false)
  }

  /**
   * Determines if some the items children are checked
   */
  someChildrenChecked() {
    return this.children.some(child => child.checked === true || child.checked === 'indeterminate')
  }

  /**
   * Retrieves the value attribute from XML attributes
   * @param {Object} attributes XML attributes
   * @param {String} value existing value
   */
  getValue(attributes, value) {
    if (value === undefined) {
      return getAttribute(attributes, 'value')
    }

    return value
  }

  /**
   * Retrieves the label attribute from XML attributes, defaults to the value attribute
   * @param {Object} attributes XML attributes
   * @param {String} value value attribute
   */
  getLabel(attributes, value) {
    if (this.originalLabel === undefined) {
      this.originalLabel = getAttribute(attributes, 'label') || value
    }

    if (!this.relevant) return `${this.originalLabel} (not available)`
    if (this.required) return `${this.originalLabel} (required)`

    return this.originalLabel
  }

  /**
   * Determines if the item should be disabled
   */
  getDisabled() {
    return this.required || !this.relevant
  }

  /**
   * Retrieves the value of the relevant attribute
   * @param {*} attributes XML attributes
   */
  getRelevant(attributes) {
    if (this.relevantAttribute === undefined) {
      this.relevantAttribute = getAttribute(attributes, 'relevant')
    }

    if (this.relevantAttribute == null) {
      return true
    }

    return getNodeValue(this.relevantAttribute, this.model, this.resolver)
  }

  /**
   * Retrieves the value of the required attribute
   * @param {*} attributes XML attributes
   */
  getRequired(attributes) {
    if (this.requiredAttribute === undefined) {
      this.requiredAttribute = getAttribute(attributes, 'required')
    }

    if (this.requiredAttribute == null) {
      return false
    }

    return getNodeValue(this.requiredAttribute, this.model, this.resolver)
  }
}
