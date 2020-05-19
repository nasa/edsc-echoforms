import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import PropTypes from 'prop-types'

import './TreeItem.css'

export const TreeItem = ({
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
    checkboxElement.current.indeterminate = checked === 'indeterminate'
  }, [checked])

  /**
   * Sets the new expanded property of the node
   */
  const onToggleExpanded = () => {
    item.setExpanded(!isExpanded)
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      style={{ marginLeft: level * 15 }}
    >
      { isParent && !isExpanded && (
        <button
          type="button"
          onClick={onToggleExpanded}
        >
          +
        </button>
      )}

      { isParent && isExpanded && (
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
        isExpanded && childItems()
      }
    </div>
  )
}

TreeItem.propTypes = {
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
    setChecked: PropTypes.func,
    setExpanded: PropTypes.func
  }).isRequired,
  model: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired
}
