import React from 'react'
import PropTypes from 'prop-types'

export const ElementWrapper = ({
  addBootstrapClasses,
  children,
  label,
  htmlFor
}) => (
  <div className={addBootstrapClasses ? 'form-group row' : ''}>
    <label htmlFor={htmlFor} className={addBootstrapClasses ? 'form-label col-form-label col-sm-2' : ''}>
      {label}
    </label>
    <div className={addBootstrapClasses ? 'col-sm-10' : ''}>
      {children}
    </div>
  </div>
)

ElementWrapper.defaultProps = {
  addBootstrapClasses: false,
  children: null,
  label: null,
  htmlFor: ''
}

ElementWrapper.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  children: PropTypes.node,
  label: PropTypes.string,
  htmlFor: PropTypes.string
}
