import React from 'react'
import PropTypes from 'prop-types'

import { Checkbox } from '../Checkbox/Checkbox'
import { TextField } from '../TextField/TextField'
import { getNodeValue } from '../../util/getNodeValue'
import { getAttribute } from '../../util/getAttribute'
import { TextArea } from '../TextArea/TextArea'
import { Output } from '../Output/Output'

export const FormElement = ({
  addBootstrapClasses,
  element,
  model,
  onUpdateModel
}) => {
  const { attributes, tagName } = element

  if (!attributes) return null

  let relevant = true
  const relevantAttribute = getAttribute(attributes, 'relevant')
  if (relevantAttribute) {
    relevant = getNodeValue(relevantAttribute, model)
  }
  if (!relevant) return null

  let readOnly = false
  const readOnlyAttribute = getAttribute(attributes, 'readonly')
  if (readOnlyAttribute) {
    readOnly = getNodeValue(readOnlyAttribute, model)
  }

  let required = false
  const requiredAttribute = getAttribute(attributes, 'required')
  if (requiredAttribute) {
    required = getNodeValue(requiredAttribute, model)
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
          addBootstrapClasses={addBootstrapClasses}
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
          addBootstrapClasses={addBootstrapClasses}
          checked={value}
          id={id}
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
  if (tagName === 'textarea') {
    return (
      <TextArea
        addBootstrapClasses={addBootstrapClasses}
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
  if (tagName === 'secret') {
    return (
      <TextField
        addBootstrapClasses={addBootstrapClasses}
        id={id}
        label={label}
        modelRef={modelRef}
        readOnly={readOnly}
        required={required}
        type="password"
        value={value}
        onUpdateModel={onUpdateModel}
      />
    )
  }
  if (tagName === 'output') {
    const type = getAttribute(attributes, 'type') || ''

    return (
      <Output
        addBootstrapClasses={addBootstrapClasses}
        id={id}
        label={label}
        required={required}
        type={type}
        value={value}
      />
    )
  }

  return (
    <p>{tagName}</p>
  )
}

FormElement.defaultProps = {
  addBootstrapClasses: false
}

FormElement.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  element: PropTypes.shape({}).isRequired,
  model: PropTypes.shape({}).isRequired,
  onUpdateModel: PropTypes.func.isRequired
}
