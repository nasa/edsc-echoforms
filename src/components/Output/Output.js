import React from 'react'
import PropTypes from 'prop-types'

export const Output = ({
  addBootstrapClasses,
  id,
  label,
  type,
  value
}) => (
  <div className={addBootstrapClasses ? 'form-group row' : ''}>
    <label className={addBootstrapClasses ? 'form-label col-form-label col-sm-2' : ''}>
      {label}
    </label>
    <div className={addBootstrapClasses ? 'col-sm-10' : ''}>
      {
        type.includes('anyURI') && (
          <a id={id} href={value}>{value}</a>
        )
      }
      {
        !type.includes('anyURI') && (
          <p id={id}>{value}</p>
        )
      }
    </div>
  </div>
)

Output.defaultProps = {
  addBootstrapClasses: false,
  id: '',
  type: '',
  value: ''
}

Output.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string,
  value: PropTypes.string
}
