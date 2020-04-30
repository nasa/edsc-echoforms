import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import murmurhash from 'murmurhash'

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
import { EchoFormsContext } from '../../context/EchoFormsContext'

/**
 * Returns a simple string type from an XML type attribute
 * @param {String} type type attribute from ECHO Forms XML
 */
const derivedType = (type) => {
  if (!type) return 'string'
  if (type.toLowerCase().includes('boolean')) return 'boolean'
  if (type.toLowerCase().includes('datetime')) return 'datetime'
  if (type.toLowerCase().includes('double')) return 'double'
  if (type.toLowerCase().includes('long')) return 'long'
  if (type.toLowerCase().includes('int')) return 'int'
  if (type.toLowerCase().includes('short')) return 'short'
  if (type.toLowerCase().includes('anyuri')) return 'anyuri'

  return 'string'
}

/**
 * Renders a component determined by the type of the element prop
 */
export const FormElement = ({
  element,
  parentReadOnly,
  model
}) => {
  const { setRelevantFields } = useContext(EchoFormsContext)
  const elementHash = murmurhash.v3(element.outerHTML, 'seed')
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
  setRelevantFields({ [elementHash]: relevant })
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

  const defaultProps = {
    elementHash,
    id,
    label,
    modelRef,
    readOnly,
    required,
    value
  }

  const type = derivedType(getAttribute(attributes, 'type'))

  if (tagName === 'input') {
    if (type === 'boolean') {
      return (
        <Checkbox checked={value} {...defaultProps}>
          {children}
        </Checkbox>
      )
    }
    if (type === 'datetime') {
      return (
        <DateTime {...defaultProps}>
          {children}
        </DateTime>
      )
    }
    if (type === 'double'
      || type === 'long'
      || type === 'int'
      || type === 'short'
    ) {
      return (
        <Number {...defaultProps} type={type}>
          {children}
        </Number>
      )
    }

    return (
      <TextField {...defaultProps}>
        {children}
      </TextField>
    )
  }
  if (tagName === 'textarea') {
    return (
      <TextArea {...defaultProps}>
        {children}
      </TextArea>
    )
  }
  if (tagName === 'secret') {
    return (
      <SecretField {...defaultProps}>
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
        {...defaultProps}
        multiple={multiple === 'true'}
        value={Array.from(value)}
        valueElementName={valueElementName}
      >
        {children}
      </Select>
    )
  }
  if (tagName === 'range') {
    const max = getAttribute(attributes, 'end')
    const min = getAttribute(attributes, 'start')
    const step = getAttribute(attributes, 'step')

    return (
      <Range
        {...defaultProps}
        max={max}
        min={min}
        step={step}
      >
        {children}
      </Range>
    )
  }
  if (tagName === 'output') {
    return (
      <Output {...defaultProps} type={type}>
        {children}
      </Output>
    )
  }
  if (tagName === 'group') {
    return (
      <Group {...defaultProps} model={model}>
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
    outerHTML: PropTypes.string,
    tagName: PropTypes.string
  }).isRequired,
  model: PropTypes.shape({}).isRequired,
  parentReadOnly: PropTypes.bool
}
