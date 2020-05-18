import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import PropTypes from 'prop-types'

export const TreeItem = ({
  item,
  model,
  onChange
}) => {
  const {
    id,
    fullValue,
    checked,
    expanded,
    level,
    disabled,
    label,
    children
  } = item
  const [timeStamp, setTimeStamp] = useState(Date.now())
  const checkboxElement = useRef(null)

  const [isExpanded, setIsExpanded] = useState(expanded)

  const childItems = () => {
    return children.map((child) => {
      return (
        <TreeItem
          key={`${child.elementHash}`}
          item={child}
          model={model}
          onChange={onChange}
        />
      )
    })
  }

  const handleChange = (e) => {
    item.setChecked(e.target.checked)
    onChange()
    setTimeStamp(Date.now())
  }

  useEffect(() => {
    checkboxElement.current.indeterminate = checked === 'indeterminate'
  }, [checked])

  const onToggleExpanded = () => {
    item.setExpanded(!isExpanded)
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      key={timeStamp}
      style={{ marginLeft: level * 15 }}
    >
      { children.length > 0 && !isExpanded && (
        <button
          type="button"
          onClick={onToggleExpanded}
        >
          +
        </button>
      )}

      { children.length > 0 && isExpanded && (
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
      <label htmlFor={id}>{label}</label>
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
    label: PropTypes.string,
    level: PropTypes.number,
    setChecked: PropTypes.func,
    setExpanded: PropTypes.func
  }).isRequired,
  model: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired
}
