import React from 'react'
import PropTypes from 'prop-types'

import { Checkbox } from '../Checkbox/Checkbox'

export const FormElement = ({
  element,
  model,
  onUpdateModel
}) => {
  const { attributes, tagName } = element

  if (!attributes) return null

  const modelRef = attributes.getNamedItem('ref')
  const label = attributes.getNamedItem('label')
  let value

  const elements = model.getElementsByTagName(modelRef.nodeValue)
  if (elements.length > 0) {
    const valueNode = elements[0]
    if (valueNode) {
      value = valueNode.childNodes[0].data
    }
  }

  if (tagName === 'input') {
    const typeAttribute = attributes.getNamedItem('type') || {}

    const { nodeValue: type = '' } = typeAttribute

    if (type.includes('boolean')) {
      return (
        <Checkbox
          label={label.nodeValue}
          modelRef={modelRef.nodeValue}
          checked={value}
          onUpdateModel={onUpdateModel}
        />
      )
    }

    return (
      <p>
        {type}
        {' '}
        other input field
      </p>
    )
  }

  return (
    <p>{tagName}</p>
  )
}

FormElement.propTypes = {
  element: PropTypes.shape({}).isRequired,
  model: PropTypes.shape({}).isRequired,
  onUpdateModel: PropTypes.func.isRequired
}
