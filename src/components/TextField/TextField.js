import React from 'react'
import PropTypes from 'prop-types'

export const TextField = ({
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
    <div className={addBootstrapClasses ? 'form-group row' : ''}>
      <label className={addBootstrapClasses ? 'form-label col-form-label col-sm-2' : ''}>
        {label}
      </label>
      <div className={addBootstrapClasses ? 'col-sm-10' : ''}>
        <input
          className={addBootstrapClasses ? 'form-control' : ''}
          id={id}
          name={label}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

TextField.defaultProps = {
  addBootstrapClasses: false,
  id: '',
  value: ''
}

TextField.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string,
  onUpdateModel: PropTypes.func.isRequired
}
