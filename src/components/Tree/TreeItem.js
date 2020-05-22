import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import PropTypes from 'prop-types'

import './TreeItem.css'

export const TreeItem = ({
  filterText,
  item,
  model,
  onChange
}) => {
  const {
    checked,
    children,
    disabled,
    expanded,
    fullValue,
    id,
    isParent,
    label,
    level,
    relevant,
    required
  } = item
  const checkboxElement = useRef(null)

  const [isExpanded, setIsExpanded] = useState(expanded)

  const childItems = () => children.map(child => (
    <TreeItem
      key={`${child.elementHash}`}
      filterText={filterText}
      item={child}
      model={model}
      onChange={onChange}
    />
  ))

  /**
   * Handle a change in the checkbox
   * @param {Object} e event object
   */
  const handleChange = (e) => {
    item.setChecked(e.target.checked)
    onChange()
  }

  // Updates the indeterminate property of the checkbox when the checked value changes
  useEffect(() => {
    if (checkboxElement.current) {
      checkboxElement.current.indeterminate = checked === 'indeterminate'
    }
  }, [checkboxElement.current, checked])

  /**
   * Sets the new expanded property of the node
   */
  const onToggleExpanded = () => {
    item.setExpanded(!isExpanded)
    setIsExpanded(!isExpanded)
  }

  let matchesFilter
  let filterExpanded

  // Don't filter anything until they type two characters
  if (filterText.length > 1) {
    filterExpanded = item.childrenMatchFilter(filterText)
    matchesFilter = item.matchesFilter(filterText)

    // If the item doesn't match or need to be expanded, don't render anything
    if (!matchesFilter && !filterExpanded) return null
  }

  return (
    <div
      style={{ marginLeft: level * 15 }}
    >
      { isParent && !isExpanded && !filterExpanded && (
        <button
          type="button"
          onClick={onToggleExpanded}
        >
          +
        </button>
      )}

      { isParent && (isExpanded || filterExpanded) && (
        <button
          type="button"
          onClick={onToggleExpanded}
        >
          -
        </button>
      )}
      <input
        id={id}
        type="checkbox"
        value={fullValue}
        onChange={handleChange}
        checked={checked}
        disabled={disabled}
        ref={checkboxElement}
      />
      <label htmlFor={id}>
        {label}
        {
          !relevant && (
            <span className="tree-item__irrelevant-label">
              (not available)
            </span>
          )
        }
        {
          required && (
            <span className="tree-item__required-label">
              (required)
            </span>
          )
        }
      </label>
      {
        (isExpanded || filterExpanded) && childItems()
      }
    </div>
  )
}

TreeItem.defaultProps = {
  filterText: ''
}

TreeItem.propTypes = {
  filterText: PropTypes.string,
  item: PropTypes.shape({
    checked: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    children: PropTypes.arrayOf(
      PropTypes.shape({
        length: PropTypes.number
      })
    ),
    disabled: PropTypes.bool,
    expanded: PropTypes.bool,
    fullValue: PropTypes.string,
    id: PropTypes.string,
    isParent: PropTypes.bool,
    label: PropTypes.string,
    level: PropTypes.number,
    relevant: PropTypes.bool,
    required: PropTypes.bool,
    childrenMatchFilter: PropTypes.func,
    matchesFilter: PropTypes.func,
    setChecked: PropTypes.func,
    setExpanded: PropTypes.func
  }).isRequired,
  model: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired
}
