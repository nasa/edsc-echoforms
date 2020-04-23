import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'
import { Help } from '../Help/Help'

export const InputField = ({
  children,
  id,
  label,
  modelRef,
  placeholder,
  readOnly,
  type,
  value
}) => {
  const { onUpdateModel } = useContext(EchoFormsContext)

  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.value)
  }

  return (
    <ElementWrapper
      htmlFor={id}
      label={label}
    >
      <input
        className={useClasses('input', 'form-control')}
        id={id}
        name={label}
        placeholder={placeholder}
        readOnly={readOnly}
        type={type}
        value={value}
        onChange={onChange}
      />
      <Help elements={children} />
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
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string,
  value: PropTypes.string
}
