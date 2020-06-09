import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'

export const InputField = ({
  children,
  elementHash,
  id,
  label,
  model,
  modelRef,
  placeholder,
  readOnly,
  required,
  type,
  value
}) => {
  const [stateValue, setStateValue] = useState(value)
  const { onUpdateModel } = useContext(EchoFormsContext)
  const { elementClasses } = useClasses()

  const onBlur = () => {
    onUpdateModel(modelRef, stateValue)
  }

  const onChange = (e) => {
    setStateValue(e.target.value)
  }

  return (
    <ElementWrapper
      elementHash={elementHash}
      formElements={children}
      htmlFor={id}
      label={label}
      model={model}
      required={required}
      type={type}
      value={value}
    >
      {
        ({ isFieldValid }) => (
          <input
            className={elementClasses('input', 'form-control', !isFieldValid)}
            id={id}
            name={label}
            placeholder={placeholder}
            readOnly={readOnly}
            type={type}
            value={stateValue}
            onBlur={onBlur}
            onChange={onChange}
          />
        )
      }
    </ElementWrapper>
  )
}

InputField.defaultProps = {
  children: null,
  id: '',
  placeholder: '',
  type: null,
  value: ''
}

InputField.propTypes = {
  children: PropTypes.shape({}),
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string,
  value: PropTypes.string
}
