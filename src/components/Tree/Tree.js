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
  required,
  separator,
  simplifyOutput,
  value,
  valueElementName
}) => {
  const {
    model: fullModel,
    resolver,
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
          modelRef,
          value: treeModel.current.simplifiedSeralize(),
          valueElementName
        })
      }

      lastSeralized.current = seralized
      onUpdateModel(modelRef, { value: seralized, valueElementName })
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
  }, [fullModel.outerHTML]) // When the tree is inside a group, it needs to update when anything in the form changes, so this useEffect runs on the full data model from the context

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
   * Build out the TreeItem list of children elements
   */
  const nodeList = () => treeModel.current.children.map(child => (
    <TreeItem
      key={`${child.elementHash}`}
      filterText={filterText}
      item={child}
      model={model}
      onChange={onChange}
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
              <div className="tree_filter">
                <input
                  className={elementClasses('tree_filter-input', 'form-control')}
                  placeholder="Filter bands"
                  value={filterText}
                  onChange={onFilterChange}
                />
              </div>
              <div className="tree__node-count">
                <span>
                  {selectedNodes}
                  {' '}
                  of
                  {' '}
                  {totalNodes}
                  {' '}
                  bands selected
                </span>
              </div>
              {nodeList()}
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
  required: PropTypes.bool.isRequired,
  separator: PropTypes.string.isRequired,
  simplifyOutput: PropTypes.bool.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  valueElementName: PropTypes.string
}
