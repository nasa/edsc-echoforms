import React from 'react'
import PropTypes from 'prop-types'

export const ElementWrapper = ({
  addBootstrapClasses,
  children,
  label
}) => (
  <div className={addBootstrapClasses ? 'form-group row' : ''}>
    <label className={addBootstrapClasses ? 'form-label col-form-label col-sm-2' : ''}>
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
  label: null
}

ElementWrapper.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  children: PropTypes.node,
  label: PropTypes.string
}
