/* eslint-disable react-hooks/exhaustive-deps */

import React, {
  useContext, useState, useRef, useEffect, useCallback
} from 'react'
import PropTypes from 'prop-types'

import { TreeItem } from './TreeItem'
import { TreeNode } from '../../util/TreeNode'
import { EchoFormsContext } from '../../context/EchoFormsContext'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { isArrayEqual } from '../../util/isArrayEqual'

export const Tree = ({
  children,
  element,
  elementHash,
  cascade,
  id,
  label,
  model,
  modelRef,
  required,
  separator,
  value,
  valueElementName
}) => {
  const { resolver, onUpdateModel } = useContext(EchoFormsContext)
  const treeModel = useRef(undefined)

  const lastSeralized = useRef([])

  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  /**
   * Update the form model with new values from the tree
   */
  const updateModel = () => {
    const seralized = treeModel.current.seralize()

    // Compare the last seralized value to the current value. If it hasn't changed, don't update the model
    if (lastSeralized.current === undefined || !isArrayEqual(seralized, lastSeralized.current)) {
      lastSeralized.current = seralized
      onUpdateModel(modelRef, { value: seralized, valueElementName })
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
      onUpdateFinished: forceUpdate
    })

    // Update the model, cascading could cause model changes
    updateModel()
  }, []) // Only execute this useEffect once on initial render

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
  }, [model.outerHTML])

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


  const nodeList = () => treeModel.current.children.map(child => (
    <TreeItem
      key={`${child.elementHash}`}
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
      model={model}
      required={required}
      value={value}
    >
      {
        () => (
          <>
            <span>
              {treeModel.current.getNumberSelectedNodes()}
              {' '}
              of
              {' '}
              {treeModel.current.getTotalLeafNodes()}
              {' '}
              bands selected
            </span>
            {nodeList()}
          </>
        )
      }
    </ElementWrapper>
  )
}

Tree.defaultProps = {
  cascade: true,
  children: null,
  id: '',
  label: '',
  value: [],
  valueElementName: ''
}

Tree.propTypes = {
  cascade: PropTypes.bool,
  children: PropTypes.shape({}),
  element: PropTypes.shape({}).isRequired,
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  model: PropTypes.shape({
    outerHTML: PropTypes.string
  }).isRequired,
  modelRef: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  separator: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  valueElementName: PropTypes.string
}
