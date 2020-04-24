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
import { Range } from '../Range/Range'

export const FormElement = ({
  element,
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
        >
          {children}
        </TextField>
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
        >
          {children}
        </Checkbox>
      )
    }
    if (type.toLowerCase().includes('datetime')) {
      return (
        <DateTime
          id={id}
          label={label}
          modelRef={modelRef}
          readOnly={readOnly}
          required={required}
          value={value}
        >
          {children}
        </DateTime>
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
      >
        {children}
      </TextArea>
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
      >
        {children}
      </SecretField>
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
  if (tagName === 'range') {
    const max = getAttribute(attributes, 'stop')
    const min = getAttribute(attributes, 'start')
    const step = getAttribute(attributes, 'step')

    return (
      <Range
        id={id}
        label={label}
        max={max}
        min={min}
        modelRef={modelRef}
        readOnly={readOnly}
        required={required}
        step={step}
        value={value}
      >
        {children}
      </Range>
    )
  }
  if (tagName === 'output') {
    const type = getAttribute(attributes, 'type')

    return (
      <Output
        id={id}
        label={label}
        type={type}
        value={value}
      >
        {children}
      </Output>
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
  parentReadOnly: undefined
}

FormElement.propTypes = {
  element: PropTypes.shape({
    attributes: PropTypes.shape({}),
    children: PropTypes.shape({}),
    tagName: PropTypes.string
  }).isRequired,
  model: PropTypes.shape({}).isRequired,
  parentReadOnly: PropTypes.bool
}
