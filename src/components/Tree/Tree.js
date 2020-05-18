import React, {
  useContext, useState, useRef, useEffect
} from 'react'
import PropTypes from 'prop-types'

import { TreeItem } from './TreeItem'
import { TreeNode } from '../../util/TreeNode'
import { EchoFormsContext } from '../../context/EchoFormsContext'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'

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

  // keyTimeStamp is a timestamp. Updating this value will force a rerender of the component because it is used as a key prop in ElementWrapper
  const [keyTimeStamp, setKeyTimeStamp] = useState(Date.now())
  const lastSeralized = useRef([])

  useEffect(() => {
    treeModel.current = new TreeNode({
      cascade,
      checkedFields: value,
      element,
      model,
      resolver,
      separator
    })
    const seralized = treeModel.current.seralize()
    lastSeralized.current = seralized
    onUpdateModel(modelRef, { value: seralized, valueElementName })
  }, [])

  const updateNode = () => {
    treeModel.current = treeModel.current.updateNode(element, model, value)
  }

  const isEqual = (array1, array2) => {
    if (array1.length !== array2.length) return false

    for (let i = 0; array1.length < i; i += 1) {
      if (array1[i] !== array2[i]) return false
    }

    return true
  }

  const updateModel = () => {
    const seralized = treeModel.current.seralize()

    // Compare the last seralized value to the current value. If it hasn't changed, don't update the model
    if (!isEqual(seralized, lastSeralized.current)) {
      lastSeralized.current = seralized
      onUpdateModel(modelRef, { value: seralized, valueElementName })
    }
  }

  const update = (async () => {
    await updateNode()
    await updateModel()
  })

  useEffect(() => {
    update()
    setKeyTimeStamp(Date.now())
  }, [model.outerHTML])

  if (!treeModel.current) {
    return (
      <div>Loading...</div>
    )
  }

  const onChange = () => {
    updateModel()
    setKeyTimeStamp(Date.now())
  }

  const nodeList = treeModel.current.children.map(child => (
    <TreeItem
      key={`${child.elementHash}`}
      item={child}
      model={model}
      onChange={onChange}
    />
  ))

  return (
    <ElementWrapper
      key={keyTimeStamp}
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
            {nodeList}
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
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  separator: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  valueElementName: PropTypes.string
}
