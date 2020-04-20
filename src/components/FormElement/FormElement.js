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
  element,
  parentModelRef,
  parentReadOnly,
  model
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
  // The readonly attribute can be inherited from a group element.
  // If a parentReadOnly prop is passed it, use that value
  if (parentReadOnly) {
    readOnly = parentReadOnly
  } else {
    const readOnlyAttribute = getAttribute(attributes, 'readonly')
    if (readOnlyAttribute) {
      readOnly = getNodeValue(readOnlyAttribute, model)
    }
  }

  let required = false
  const requiredAttribute = getAttribute(attributes, 'required')
  if (requiredAttribute) {
    required = getNodeValue(requiredAttribute, model)
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
          id={id}
          label={label}
          modelRef={modelRef}
          readOnly={readOnly}
          required={required}
          value={value}
        />
      )
    }
    if (type.includes('boolean')) {
      return (
        <Checkbox
          checked={value}
          id={id}
          label={label}
          modelRef={modelRef}
          readOnly={readOnly}
          required={required}
        />
      )
    }
    if (type.includes('datetime')) {
      return (
        <DateTime
          id={id}
          label={label}
          modelRef={modelRef}
          readOnly={readOnly}
          required={required}
          value={value}
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
        id={id}
        label={label}
        modelRef={modelRef}
        readOnly={readOnly}
        required={required}
        value={value}
      />
    )
  }
  if (tagName === 'secret') {
    return (
      <SecretField
        id={id}
        label={label}
        modelRef={modelRef}
        readOnly={readOnly}
        required={required}
        value={value}
      />
    )
  }
  if (tagName === 'select') {
    const multiple = getAttribute(attributes, 'multiple')
    const valueElementName = getAttribute(attributes, 'valueElementName')

    return (
      <Select
        id={id}
        label={label}
        modelRef={modelRef}
        multiple={multiple === 'true'}
        readOnly={readOnly}
        required={required}
        value={Array.from(value)}
        valueElementName={valueElementName}
      >
        {children}
      </Select>
    )
  }
  if (tagName === 'output') {
    const type = getAttribute(attributes, 'type')

    return (
      <Output
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
        id={id}
        label={label}
        model={model}
        modelRef={modelRef}
        readOnly={readOnly}
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
  parentModelRef: undefined,
  parentReadOnly: undefined
}

FormElement.propTypes = {
  element: PropTypes.shape({
    attributes: PropTypes.shape({}),
    children: PropTypes.shape({}),
    tagName: PropTypes.string
  }).isRequired,
  model: PropTypes.shape({}).isRequired,
  parentModelRef: PropTypes.string,
  parentReadOnly: PropTypes.bool
}
