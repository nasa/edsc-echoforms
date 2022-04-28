import murmurhash from 'murmurhash'

import { getAttribute } from './getAttribute'
import { getNodeValue } from './getNodeValue'

export class TreeNode {
  constructor(props) {
    // Properties based on props
    this.props = props
    this.cascade = this.props.cascade
    this.checkedFields = this.props.checkedFields
    this.element = this.props.element
    this.level = this.props.level || 0
    this.model = this.props.model
    this.parentChecked = this.props.parentChecked // Used for cascading from the top down on initial render
    this.resolver = this.props.resolver
    this.separator = this.props.separator
    this.simplifyOutput = this.props.simplifyOutput
    this.onUpdateFinished = this.props.onUpdateFinished

    // elementHash used as key for TreeItem components
    this.elementHash = murmurhash.v3(this.element.outerHTML, 'seed')

    // Properties with default values
    this.allItems = {}
    this.checked = false
    this.children = []
    this.disabled = false
    this.expanded = this.level === 1

    // Properties derived from element attributes, default to undefined for caching
    this.relevantAttribute = undefined
    this.requiredAttribute = undefined
    this.totalLeafNodes = undefined
    this.value = undefined

    // Build remaining node properties
    this.buildNode(props)

    // Bind methods
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
    this.matchesFilter = this.matchesFilter.bind(this)
    this.childrenMatchFilter = this.childrenMatchFilter.bind(this)
  }

  /**
   * Builds the remaining properties of the current tree item based on element attributes
   * @param {Object} item
   * @param {Object} item.element current item's XML element
   * @param {Object} item.parent current item's parent item
   */
  buildNode({
    element,
    parent = {}
  }) {
    const { attributes, children } = element
    this.value = this.getValue(attributes, this.value)
    this.fullValue = this.getFullValue(parent.fullValue, this.value)
    this.id = this.fullValue
    this.label = this.getLabel(attributes, this.value)

    // Don't add the 'tree' element to allItems
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
    this.disabled = this.getDisabled()
    this.checked = this.determineChecked(
      this.checkedFields.includes(this.fullValue) || this.required
    )

    // this.onUpdateFinished is only defined at the top level. if it exists call the function to let the component know to rerender
    if (this.onUpdateFinished) {
      this.onUpdateFinished()
    }
  }

  /**
   * Sets up the children of the node
   * @param {Object} children HTMLCollection of item children
   */
  setupChildren(children) {
    Array.from(children)
      .filter((child) => child.tagName === 'item')
      .forEach((child) => {
        // Setup new TreeNode for each child
        const childNode = new TreeNode({
          ...this.props,
          level: this.level + 1,
          element: child,
          parent: this,
          parentChecked: this.checkedFields.includes(this.fullValue)
            || this.required
            || this.parentChecked,
          onUpdateFinished: undefined
        })

        // Add the childNode and the childNode's allItems to this node's allItems
        this.allItems = {
          ...this.allItems,
          [childNode.fullValue]: childNode,
          ...childNode.allItems
        }

        // Add the childNode to this nodes children
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

    // Update properties that need evaluation
    this.setup(attributes)

    return this
  }

  /**
   * Updates the current node's children
   */
  updateChildren() {
    this.children.forEach((child) => {
      // Clear parent checked as this isn't the initial render
      // eslint-disable-next-line no-param-reassign
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
      if (item.checked === true) checked.push(item.fullValue)
    })

    return checked
  }

  /**
   * Seralizes a simplified version of the tree data.
   * If a parent is checked, we don't want to know every single child that is also checked.
   */
  simplifiedSeralize() {
    const checked = []

    Object.keys(this.allItems).forEach((key) => {
      const item = this.allItems[key]

      let shouldAdd = false
      if (item.checked === true) {
        if (item.isParent && item.allChildrenChecked()) {
          // If the item is a parent will all children checked, only add the item if it is also a child without a checked parent, or if it isn't a child
          if (item.isChild && item.parent.checked !== true) {
            shouldAdd = true
          } else if (!item.isChild) {
            shouldAdd = true
          }
        } else if (!item.isParent && item.parent.checked !== true) {
          // If the item is not a parent, only add the item if it's parent is not checked
          shouldAdd = true
        }
      }

      if (shouldAdd) checked.push(item.fullValue)
    })

    return checked
  }

  /**
   * Format filter text to ensure matching results
   * @param {String} text formatText
   */
  formatFilterText(text) {
    return text.trim().toLowerCase()
  }

  /**
   * Determines if the node matches the given text
   * @param {String} filterText text to filter the node on
   */
  matchesFilter(filterText) {
    return this.label.toLowerCase().indexOf(this.formatFilterText(filterText)) !== -1
  }

  /**
   * Determines if any of the nodes children matches the given text
   * @param {String} filterText text to filter the node on
   */
  childrenMatchFilter(filterText) {
    return this.children.some((item) => (
      item.matchesFilter(this.formatFilterText(filterText))
        || item.childrenMatchFilter(this.formatFilterText(filterText))
    ))
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
      if (value.isLeaf && value.checked === true) return total + 1
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

    if (this.cascade) {
      // parentChecked used to determine checked value with cascading during initial render
      if (this.parent && this.parentChecked === true) {
        return true
      }
    }

    // if cascade is false or this is a leaf, and a value does exist, return that value
    if ((!this.cascade || this.isLeaf) && value != null) {
      return value
    }

    // If cascade is true, determine if this node should be checked based on children all checked or some checked
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

    // If the node is currently indeterminate, clicking the checkbox should switch to checked
    if (this.checked === 'indeterminate') {
      newChecked = true

      // If all enabled children are checked, newChecked should be false
      if (this.allEnabledChildrenChecked()) newChecked = false
    }

    // Required fields are always checked
    this.checked = newChecked || this.required

    // Irrelevant fields are never checked
    if (!this.relevant) this.checked = false

    // If cascading, set all children equal to this node
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
   * Determines if all the item's children are checked
   */
  allChildrenChecked() {
    return this.children.every((child) => child.checked === true)
  }

  /**
   * Determines if all the item's enabled children are checked
   */
  allEnabledChildrenChecked() {
    return this.children.every((child) => child.checked === true || child.getDisabled())
  }

  /**
   * Determines if some the item's children are checked
   */
  someChildrenChecked() {
    return this.children.some((child) => child.checked === true || child.checked === 'indeterminate')
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
    if (this.label === undefined) {
      this.label = getAttribute(attributes, 'label') || value
    }

    return this.label
  }

  /**
   * Determines if the item should be disabled
   */
  getDisabled() {
    return (
      this.required
      || !this.relevant
      || (
        this.isParent
        && this.children.every((child) => child.getDisabled())
      )
    )
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
