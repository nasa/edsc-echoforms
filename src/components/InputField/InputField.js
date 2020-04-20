import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../util/useClasses'
import { EchoFormsContext } from '../../util/EchoFormsContext'

export const InputField = ({
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
    </ElementWrapper>
  )
}

InputField.defaultProps = {
  id: '',
  placeholder: '',
  type: null,
  value: ''
}

InputField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string,
  value: PropTypes.string
}
