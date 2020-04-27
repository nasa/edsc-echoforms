import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { getAttribute } from '../../util/getAttribute'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'
import { Help } from '../Help/Help'

export const Select = ({
  children,
  id,
  label,
  modelRef,
  multiple,
  readOnly,
  required,
  value,
  valueElementName
}) => {
  const { onUpdateModel } = useContext(EchoFormsContext)

  const onChange = (e) => {
    // Map e.target.selectedOptions to an array of objects with the value and valueElementName
    const { selectedOptions } = e.target

    const values = []
    Array.from(selectedOptions).forEach((option) => {
      const { value } = option
      values.push({ value, valueElementName })
    })

    onUpdateModel(modelRef, values)
  }

  let isInvalid = false
  let errorMessage
  if (required && !value.length) {
    isInvalid = true
    errorMessage = 'Required field'
  }

  return (
    <ElementWrapper
      htmlFor={id}
      label={label}
    >
      <select
        className={useClasses('select__input', 'form-control', isInvalid)}
        id={id}
        name={label}
        multiple={multiple}
        readOnly={readOnly}
        value={multiple ? value : value[0]}
        onChange={onChange}
      >
        {
          !multiple && value.length === 0 && (
            <option
              key="default option"
            >
              Select a value
            </option>
          )
        }
        {
          children && Array.from(children)
            .filter(element => element.tagName === 'item')
            .map((element) => {
              const { attributes } = element

              const optionLabel = getAttribute(attributes, 'label')
              const optionValue = getAttribute(attributes, 'value')
              return (
                <option
                  key={`option-${optionValue}`}
                  value={optionValue}
                >
                  {optionLabel}
                </option>
              )
            })
        }
      </select>
      {
        isInvalid && (
          <div className="invalid-feedback">
            {errorMessage}
          </div>
        )
      }
      <Help elements={children} />
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
  id: PropTypes.string,
  label: PropTypes.string,
  modelRef: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  valueElementName: PropTypes.string
}
