import React, {
  useContext, useState, useRef, useEffect, useCallback
} from 'react'
import PropTypes from 'prop-types'

import { TreeItem } from './TreeItem'
import { TreeNode } from '../../util/TreeNode'
import { EchoFormsContext } from '../../context/EchoFormsContext'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { isArrayEqual } from '../../util/isArrayEqual'
import { useClasses } from '../../hooks/useClasses'

import './Tree.scss'

export const Tree = ({
  children,
  element,
  elementHash,
  cascade,
  id,
  label,
  maxParameters,
  model,
  modelRef,
  parentRef,
  required,
  separator,
  simplifyOutput,
  value,
  valueElementName
}) => {
  const {
    model: fullModel,
    resolver,
    simplifiedTree,
    setSimplifiedTree,
    onUpdateModel
  } = useContext(EchoFormsContext)
  const { elementClasses } = useClasses()

  const treeModel = useRef(undefined)

  const lastSeralized = useRef([])

  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  const [totalNodes, setTotalNodes] = useState(0)
  const [selectedNodes, setSelectedNodes] = useState(0)
  const [maxParametersError, setMaxParametersError] = useState(null)

  const [filterText, setFilterText] = useState('')

  /**
   * Update the form model with new values from the tree
   */
  const updateModel = () => {
    const seralized = treeModel.current.seralize()

    // Compare the last seralized value to the current value. If it hasn't changed, don't update the model
    if (lastSeralized.current === undefined || !isArrayEqual(seralized, lastSeralized.current)) {
      // If simplifyOutput, save a simplified tree output to be added to the model later
      if (simplifyOutput) {
        setSimplifiedTree({
          ...simplifiedTree.current,
          [id]: {
            parentRef,
            modelRef,
            value: treeModel.current.simplifiedSeralize(),
            valueElementName
          }
        })
      }

      lastSeralized.current = seralized
      onUpdateModel(parentRef, modelRef, { value: seralized, valueElementName })
      setSelectedNodes(treeModel.current.getNumberSelectedNodes())
    }
  }

  // Initial render - setup TreeNode object to drive the tree data
  useEffect(() => {
    treeModel.current = new TreeNode({
      cascade,
      checkedFields: value,
      element,
      model,
      resolver,
      separator,
      simplifyOutput,
      onUpdateFinished: forceUpdate
    })

    // Update the model, cascading could cause model changes
    updateModel()
    setTotalNodes(treeModel.current.getTotalLeafNodes())
    setSelectedNodes(treeModel.current.getNumberSelectedNodes())
  }, []) // Only execute this useEffect once on initial render

  // When selectedNodes changes, set maxParametersError
  useEffect(() => {
    if (!simplifyOutput && maxParameters) {
      if (selectedNodes > parseInt(maxParameters, 10)) {
        setMaxParametersError(`No more than ${maxParameters} parameters can be selected.`)
      } else {
        setMaxParametersError(null)
      }
    }
  }, [selectedNodes])

  /**
   * Update the treeModel with new values
   */
  const updateTreeModel = () => {
    treeModel.current = treeModel.current.updateNode(element, model, value)
  }

  /**
   * Update the tree model, then update the form model with changes from the update
   */
  const update = (async () => {
    await updateTreeModel()
    await updateModel()
  })

  // Update the treeModel when the form model data changes
  useEffect(() => {
    update()
  }, [fullModel]) // When the tree is inside a group, it needs to update when anything in the form changes, so this useEffect runs on the full data model from the context

  if (!treeModel.current) {
    return (
      <div>Loading...</div>
    )
  }

  /**
   * onChange callback from TreeItem, update the form model
   */
  const onChange = () => {
    updateModel()
  }

  /**
   * Sets the filterText state
   * @param {Object} e event object
   */
  const onFilterChange = (e) => {
    const { value } = e.target
    setFilterText(value)
  }

  /**
   * Sets the filterText state
   * @param {Object} e event object
   */
  const onFilterClear = () => {
    setFilterText('')
  }

  /**
   * Build out the TreeItem list of children elements
   */
  const nodeList = () => treeModel.current.children.map((child, i) => (
    <TreeItem
      key={`${child.elementHash}`}
      filterText={filterText}
      item={child}
      model={model}
      onChange={onChange}
      isFirst={i === 0}
      isLast={i === treeModel.current.children.length - 1}
    />
  ))

  return (
    <ElementWrapper
      elementHash={elementHash}
      formElements={children}
      htmlFor={id}
      label={label}
      manualError={maxParametersError}
      model={model}
      required={required}
      value={value}
    >
      {
        ({ isFieldValid }) => (
          <>
            <div className={elementClasses('tree', '', !isFieldValid)}>
              <div className={elementClasses('tree__filter')}>
                <label
                  className={elementClasses('tree__filter-label', 'sr-only')}
                  htmlFor="tree_filter_input"
                >
                  Filter
                </label>
                <div className={elementClasses('tree__filter-input-group', 'input-group input-group-sm mb-2 mt-1')}>
                  <div className={elementClasses('tree__filter-input-group-prepend', 'input-group-prepend input-group-prepend-sm')}>
                    <div className="input-group-text">Filter</div>
                  </div>
                  <input
                    id="tree_filter_input"
                    name="tree_filter_input"
                    className={elementClasses('tree__filter-input', 'form-control form-control-sm')}
                    placeholder="Enter text to filter bands"
                    value={filterText}
                    onChange={onFilterChange}
                  />
                  <div className={elementClasses('tree__filter-input-append tree__filter-input-append--clear', 'input-group-append')}>
                    <button
                      type="button"
                      label="Clear"
                      value=""
                      className={elementClasses('tree__filter-clear-button', 'btn btn-outline-secondary form-control-sm')}
                      onClick={onFilterClear}
                    >
                      <span className={elementClasses('tree__filter-clear-button-text', '')}>
                        Clear
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className={elementClasses('tree__node-count', 'mb-3')}>
                <span className={elementClasses('tree__node-count-text', 'text-secondary small')}>
                  {selectedNodes}
                  {' '}
                  of
                  {' '}
                  {totalNodes}
                  {' '}
                  bands selected
                </span>
              </div>
              <div className="tree__list-wrapper">
                <div className="tree__list">
                  {nodeList()}
                </div>
              </div>
            </div>
          </>
        )
      }
    </ElementWrapper>
  )
}

Tree.defaultProps = {
  children: null,
  id: '',
  label: '',
  maxParameters: null,
  parentRef: null,
  value: [],
  valueElementName: ''
}

Tree.propTypes = {
  cascade: PropTypes.bool.isRequired,
  children: PropTypes.shape({}),
  element: PropTypes.shape({}).isRequired,
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  maxParameters: PropTypes.string,
  model: PropTypes.shape({
    outerHTML: PropTypes.string
  }).isRequired,
  modelRef: PropTypes.string.isRequired,
  parentRef: PropTypes.string,
  required: PropTypes.bool.isRequired,
  separator: PropTypes.string.isRequired,
  simplifyOutput: PropTypes.bool.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  valueElementName: PropTypes.string
}
