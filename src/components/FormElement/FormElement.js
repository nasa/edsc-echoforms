import React from 'react'
import PropTypes from 'prop-types'

import { Checkbox } from '../Checkbox/Checkbox'
import { TextField } from '../TextField/TextField'
import { checkRelevant } from '../../util/checkRelevant'
import { getNodeValue } from '../../util/getNodeValue'
import { getAttribute } from '../../util/getAttribute'

export const FormElement = ({
  element,
  model,
  onUpdateModel
}) => {
  const { attributes, tagName } = element

  if (!attributes) return null

  let relevant = true
  const relevantAttribute = getAttribute(attributes, 'relevant')
  if (relevantAttribute) {
    relevant = checkRelevant(relevantAttribute, model)
  }
  if (!relevant) return null

  let readOnly = false
  const readOnlyAttribute = getAttribute(attributes, 'readonly')
  if (readOnlyAttribute) {
    readOnly = checkRelevant(readOnlyAttribute, model)
  }

  let required = false
  const requiredAttribute = getAttribute(attributes, 'required')
  if (requiredAttribute) {
    required = checkRelevant(requiredAttribute, model)
  }

  const modelRef = getAttribute(attributes, 'ref')
  const label = getAttribute(attributes, 'label')
  const id = getAttribute(attributes, 'id')

  let value
  if (modelRef) {
    value = getNodeValue(modelRef, model)
  } else {
    value = getAttribute(attributes, 'value')
  }

  if (tagName === 'input') {
    const type = getAttribute(attributes, 'type') || ''

    if (type.includes('string') || type === '') {
      return (
        <TextField
          id={id}
          label={label}
          modelRef={modelRef}
          readOnly={readOnly}
          required={required}
          value={value}
          onUpdateModel={onUpdateModel}
        />
      )
    }
    if (type.includes('boolean')) {
      return (
        <Checkbox
          checked={value}
          label={label}
          modelRef={modelRef}
          readOnly={readOnly}
          required={required}
          onUpdateModel={onUpdateModel}
        />
      )
    }

    return (
      <p>
        {type}
        {' '}
        other input field
        {', '}
        {id}
        {', '}
        {label}
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
