import React, { useContext, useRef } from 'react'
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
import { Tree } from '../Tree/Tree'
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
  const { resolver, setRelevantFields } = useContext(EchoFormsContext)

  // These calls to getAttribute don't need to happen on every render because they are string attributes that will never change.
  // useRef allows us to keep the value for the life of the component with only fetching them from the XML once
  const relevantAttribute = useRef(undefined)
  const readOnlyAttribute = useRef(undefined)
  const requiredAttribute = useRef(undefined)
  const modelRef = useRef(undefined)
  const label = useRef(undefined)
  const id = useRef(undefined)
  const type = useRef(undefined)

  const elementHash = murmurhash.v3(element.outerHTML, 'seed')
  const {
    attributes,
    children,
    tagName
  } = element

  if (!attributes) return null

  if (relevantAttribute.current === undefined) {
    relevantAttribute.current = getAttribute(attributes, 'relevant')
  }
  let relevant = true
  if (relevantAttribute.current) {
    relevant = getNodeValue(relevantAttribute.current, model, resolver)
  }
  setRelevantFields({ [elementHash]: relevant })
  if (!relevant) return null

  let readOnly = false
  // The readonly attribute can be inherited from a group element.
  // If a parentReadOnly prop is passed it, use that value
  if (parentReadOnly) {
    readOnly = parentReadOnly
  } else {
    if (readOnlyAttribute.current === undefined) {
      readOnlyAttribute.current = getAttribute(attributes, 'readonly')
    }
    if (readOnlyAttribute.current) {
      readOnly = getNodeValue(readOnlyAttribute.current, model, resolver)
    }
  }

  if (requiredAttribute.current === undefined) {
    requiredAttribute.current = getAttribute(attributes, 'required')
  }
  let required = false
  if (requiredAttribute.current) {
    required = getNodeValue(requiredAttribute.current, model, resolver)
  }

  if (modelRef.current === undefined) {
    modelRef.current = getAttribute(attributes, 'ref')
  }
  if (label.current === undefined) {
    label.current = getAttribute(attributes, 'label')
  }
  if (id.current === undefined) {
    id.current = getAttribute(attributes, 'id')
  }

  let value
  if (modelRef.current) {
    value = getNodeValue(modelRef.current, model, resolver, tagName === 'tree')
  } else {
    value = getAttribute(attributes, 'value')
  }

  const defaultProps = {
    elementHash,
    id: id.current,
    label: label.current,
    model,
    modelRef: modelRef.current,
    readOnly,
    required,
    value
  }

  if (type.current === undefined) {
    type.current = derivedType(getAttribute(attributes, 'type'))
  }

  if (tagName === 'input') {
    if (type.current === 'boolean') {
      return (
        <Checkbox checked={value} {...defaultProps}>
          {children}
        </Checkbox>
      )
    }
    if (type.current === 'datetime') {
      return (
        <DateTime {...defaultProps}>
          {children}
        </DateTime>
      )
    }
    if (type.current === 'double'
      || type.current === 'long'
      || type.current === 'int'
      || type.current === 'short'
    ) {
      return (
        <Number {...defaultProps} type={type.current}>
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
      <Output {...defaultProps} type={type.current}>
        {children}
      </Output>
    )
  }
  if (tagName === 'group') {
    return (
      <Group {...defaultProps}>
        {children}
      </Group>
    )
  }
  if (tagName === 'tree') {
    const cascade = getAttribute(attributes, 'cascade') || 'true'
    const maxParameters = getAttribute(attributes, 'maxParameters')
    const separator = getAttribute(attributes, 'separator')
    // const simplifyOutput = getAttribute(attributes, 'simplifyOutput') || 'true'
    const valueElementName = getAttribute(attributes, 'valueElementName') || 'value'

    return (
      <Tree
        {...defaultProps}
        element={element}
        cascade={cascade === 'true'}
        maxParameters={maxParameters}
        separator={separator}
        // simplifyOutput={simplifyOutput === 'true'}
        valueElementName={valueElementName}
      >
        {children}
      </Tree>
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
