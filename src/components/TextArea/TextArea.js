import React from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'

export const TextArea = ({
  addBootstrapClasses,
  id,
  label,
  modelRef,
  readOnly,
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
      <textarea
        className={addBootstrapClasses ? 'form-control' : ''}
        id={id}
        name={label}
        readOnly={readOnly}
        value={value}
        onChange={onChange}
      />
    </ElementWrapper>
  )
}

TextArea.defaultProps = {
  addBootstrapClasses: false,
  id: '',
  value: ''
}

TextArea.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string,
  onUpdateModel: PropTypes.func.isRequired
}
