import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { getAttribute } from '../../util/getAttribute'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'

export const Select = ({
  children,
  elementHash,
  id,
  label,
  model,
  modelRef,
  multiple,
  readOnly,
  required,
  value,
  valueElementName
}) => {
  const { onUpdateModel } = useContext(EchoFormsContext)
  const { elementClasses } = useClasses()

  const onChange = (e) => {
    // Map e.target.selectedOptions to an array of objects with the value and valueElementName
    const { selectedOptions } = e.target

    const values = []
    Array.from(selectedOptions).forEach((option) => {
      const { value } = option
      values.push(value)
    })

    onUpdateModel(modelRef, { value: values, valueElementName })
  }

  const options = []
  if (!multiple) {
    options.push(
      <option
        key="default option"
      >
        Select a value
      </option>
    )
  }

  Array.from(children)
    .filter(element => element.tagName === 'item')
    .forEach((element) => {
      const { attributes } = element

      const optionLabel = getAttribute(attributes, 'label')
      const optionValue = getAttribute(attributes, 'value')
      options.push(
        <option
          key={`option-${optionValue}`}
          value={optionValue}
        >
          {optionLabel}
        </option>
      )
    })

  return (
    <ElementWrapper
      elementHash={elementHash}
      formElements={children}
      htmlFor={id}
      label={label}
      model={model}
      required={required}
      value={value}
    >
      {
        ({ isFieldValid }) => (
          <select
            className={elementClasses('select__input', 'form-control', !isFieldValid)}
            id={id}
            name={label}
            multiple={multiple}
            readOnly={readOnly}
            value={multiple ? value : value[0]}
            onChange={onChange}
          >
            {options}
          </select>
        )
      }
    </ElementWrapper>
  )
}

Select.defaultProps = {
  children: null,
  id: '',
  label: '',
  multiple: false,
  value: [],
  valueElementName: ''
}

Select.propTypes = {
  children: PropTypes.shape({}),
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  valueElementName: PropTypes.string
}
