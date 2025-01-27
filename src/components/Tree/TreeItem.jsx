import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'
import { IconContext } from 'react-icons'

import { INDETERMINATE } from '../../constants'
import { useClasses } from '../../hooks/useClasses'

import './TreeItem.scss'

export const TreeItem = ({
  filterText,
  item,
  model,
  onChange,
  isFirst,
  isLast
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
  const { elementClasses } = useClasses()
  const [isExpanded, setIsExpanded] = useState(expanded)

  const childItems = () => children.map((child, i) => (
    <TreeItem
      key={`${child.elementHash}`}
      filterText={filterText}
      item={child}
      model={model}
      onChange={onChange}
      isFirst={i === 0}
      isLast={i === children.length - 1}
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
      checkboxElement.current.indeterminate = checked === INDETERMINATE
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

  const isClosed = !isExpanded && !filterExpanded

  let treeItemClasses = 'ef-tree-item'

  treeItemClasses += ` ${`ef-tree-item--child-${level}`}`
  treeItemClasses += ` ${isParent ? 'ef-tree-item--is-parent' : ''}`
  treeItemClasses += ` ${isFirst ? 'ef-tree-item--is-first' : ''}`
  treeItemClasses += ` ${isLast ? 'ef-tree-item--is-last' : ''}`
  treeItemClasses += ` ${!isClosed ? 'ef-tree-item--is-open' : ''}`
  treeItemClasses += ` ${isLast ? 'ef-tree-item--has-blocker' : ''}`
  treeItemClasses += ` ${!relevant ? 'ef-tree-item--is-not-relevant' : ''}`

  return (
    <div
      className={elementClasses(treeItemClasses)}
    >
      <div
        className={elementClasses('ef-tree-item__header')}
      >
        {
          isParent && (
            <button
              className={elementClasses('ef-tree-item__parent-button', 'btn')}
              type="button"
              onClick={onToggleExpanded}
              data-cy={`ef-tree-item__parent-button-${level}`}
            >
              <IconContext.Provider value={
                // eslint-disable-next-line react/jsx-no-constructed-context-values
                {
                  style: {
                    width: '1.25em'
                  }
                }
              }
              >
                {
                  isClosed
                    ? <FaFolder />
                    : <FaFolderOpen />
                }
              </IconContext.Provider>
            </button>
          )
        }
        <input
          id={id}
          className={elementClasses('ef-tree-item__checkbox')}
          type="checkbox"
          value={fullValue}
          onChange={handleChange}
          checked={checked}
          disabled={disabled}
          ref={checkboxElement}
          data-cy={fullValue}
        />
        <label
          className={elementClasses('ef-tree-item__label')}
          htmlFor={id}
        >
          {label}
          {
            !relevant && (
              <span className={elementClasses('ef-tree-item__irrelevant-label', 'ms-1 small')}>
                (not available)
              </span>
            )
          }
          {
            required && (
              <span className={elementClasses('ef-tree-item__required-label', 'ms-1 small')}>
                (required)
              </span>
            )
          }
        </label>
      </div>

      {(isExpanded || filterExpanded) && childItems()}
    </div>
  )
}

TreeItem.defaultProps = {
  filterText: ''
}

TreeItem.propTypes = {
  filterText: PropTypes.string,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
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
