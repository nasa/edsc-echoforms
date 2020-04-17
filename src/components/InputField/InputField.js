import React from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'

export const InputField = ({
  addBootstrapClasses,
  id,
  label,
  modelRef,
  placeholder,
  readOnly,
  type,
  value,
  onUpdateModel
}) => {
  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.value)
  }

  return (
    <ElementWrapper
      addBootstrapClasses={addBootstrapClasses}
      htmlFor={id}
      label={label}
    >
      <input
        className={addBootstrapClasses ? 'form-control' : ''}
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
  addBootstrapClasses: false,
  id: '',
  placeholder: '',
  type: null,
  value: ''
}

InputField.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onUpdateModel: PropTypes.func.isRequired
}
