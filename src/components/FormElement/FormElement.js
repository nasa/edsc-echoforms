import React from 'react'
import PropTypes from 'prop-types'

import { getAttribute } from '../../util/getAttribute'
import { getNodeValue } from '../../util/getNodeValue'
import { Checkbox } from '../Checkbox/Checkbox'
import { Output } from '../Output/Output'
import { SecretField } from '../SecretField/SecretField'
import { TextArea } from '../TextArea/TextArea'
import { TextField } from '../TextField/TextField'
import { Select } from '../Select/Select'
import { DateTime } from '../DateTime/DateTime'
import { Group } from '../Group/Group'

export const FormElement = ({
  addBootstrapClasses,
  element,
  parentModelRef,
  parentReadOnly,
  parentRequired,
  model,
  onUpdateModel
}) => {
  const {
    attributes,
    children,
    tagName
  } = element

  if (!attributes) return null

  let relevant = true
  const relevantAttribute = getAttribute(attributes, 'relevant')
  if (relevantAttribute) {
    relevant = getNodeValue(relevantAttribute, model)
  }
  if (!relevant) return null

  let readOnly = false
  if (parentReadOnly) {
    readOnly = parentReadOnly
  } else {
    const readOnlyAttribute = getAttribute(attributes, 'readonly')
    if (readOnlyAttribute) {
      readOnly = getNodeValue(readOnlyAttribute, model)
    }
  }

  let required = false
  if (parentRequired) {
    required = parentRequired
  } else {
    const requiredAttribute = getAttribute(attributes, 'required')
    if (requiredAttribute) {
      required = getNodeValue(requiredAttribute, model)
    }
  }

  // Prepend the parentModelRef with a trailing `/`
  const modelRef = [
    parentModelRef,
    getAttribute(attributes, 'ref')
  ]
    .filter(Boolean)
    .join('/')

  const label = getAttribute(attributes, 'label')
  const id = getAttribute(attributes, 'id')

  let value
  if (modelRef) {
    value = getNodeValue(modelRef, model)
  } else {
    value = getAttribute(attributes, 'value')
  }

  if (tagName === 'input') {
    const type = getAttribute(attributes, 'type')

    if (type == null || type.includes('string')) {
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
    if (type.includes('datetime')) {
      return (
        <DateTime
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
      <SecretField
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
  if (tagName === 'select') {
    const multiple = getAttribute(attributes, 'multiple')
    const valueElementName = getAttribute(attributes, 'valueElementName')

    return (
      <Select
        addBootstrapClasses={addBootstrapClasses}
        id={id}
        label={label}
        modelRef={modelRef}
        multiple={multiple === 'true'}
        readOnly={readOnly}
        required={required}
        value={Array.from(value)}
        valueElementName={valueElementName}
        onUpdateModel={onUpdateModel}
      >
        {children}
      </Select>
    )
  }
  if (tagName === 'output') {
    const type = getAttribute(attributes, 'type')

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
  if (tagName === 'group') {
    return (
      <Group
        addBootstrapClasses={addBootstrapClasses}
        id={id}
        label={label}
        model={model}
        modelRef={modelRef}
        readOnly={readOnly}
        required={required}
        onUpdateModel={onUpdateModel}
      >
        {children}
      </Group>
    )
  }

  return (
    <p>{tagName}</p>
  )
}

FormElement.defaultProps = {
  addBootstrapClasses: false,
  parentModelRef: undefined,
  parentReadOnly: undefined,
  parentRequired: undefined
}

FormElement.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  element: PropTypes.shape({
    attributes: PropTypes.shape({}),
    children: PropTypes.shape({}),
    tagName: PropTypes.string
  }).isRequired,
  model: PropTypes.shape({}).isRequired,
  parentModelRef: PropTypes.string,
  parentReadOnly: PropTypes.bool,
  parentRequired: PropTypes.bool,
  onUpdateModel: PropTypes.func.isRequired
}
