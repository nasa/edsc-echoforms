import React from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'

export const Checkbox = ({
  addBootstrapClasses,
  checked,
  id,
  label,
  modelRef,
  readOnly,
  onUpdateModel
}) => {
  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.checked)
  }

  return (
    <ElementWrapper
      addBootstrapClasses={addBootstrapClasses}
      htmlFor={id}
      label={label}
    >
      <>
        <input
          className={addBootstrapClasses ? 'form-check-input' : ''}
          checked={checked === 'true'}
          id={id}
          name={label}
          readOnly={readOnly}
          type="checkbox"
          onChange={onChange}
        />
        <label
          className={addBootstrapClasses ? 'form-check-label' : ''}
          htmlFor={id}
        >
          {label}
        </label>
      </>
    </ElementWrapper>
  )
}

Checkbox.defaultProps = {
  addBootstrapClasses: false,
  id: '',
  label: ''
}

Checkbox.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  checked: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  onUpdateModel: PropTypes.func.isRequired
}
