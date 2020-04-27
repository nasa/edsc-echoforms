import React from 'react'
import PropTypes from 'prop-types'

import { getAttribute } from '../../util/getAttribute'
import { getNodeValue } from '../../util/getNodeValue'

import { Checkbox } from '../Checkbox/Checkbox'
import { DateTime } from '../DateTime/DateTime'
import { Group } from '../Group/Group'
import { Number } from '../Number/Number'
import { Output } from '../Output/Output'
import { Range } from '../Range/Range'
import { SecretField } from '../SecretField/SecretField'
import { Select } from '../Select/Select'
import { TextArea } from '../TextArea/TextArea'
import { TextField } from '../TextField/TextField'

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

    if (type && type.includes('boolean')) {
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
    if (type && type.toLowerCase().includes('datetime')) {
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
    if (type && (
      type.toLowerCase().includes('double')
      || type.toLowerCase().includes('long')
      || type.toLowerCase().includes('int')
      || type.toLowerCase().includes('short'))
    ) {
      return (
        <Number
          id={id}
          label={label}
          modelRef={modelRef}
          readOnly={readOnly}
          required={required}
          type={type}
          value={value}
        >
          {children}
        </Number>
      )
    }

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
  if (tagName === 'select' || tagName === 'selectref') {
    const multiple = getAttribute(attributes, 'multiple')
    let valueElementName = getAttribute(attributes, 'valueElementName')

    // As used, selectrefs turn out to be identical to selects, with valueElementName defaulted to 'value'
    if (tagName === 'selectref' && valueElementName === null) {
      valueElementName = 'value'
    }

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
