import React from 'react'
import PropTypes from 'prop-types'
import { useClasses } from '../../util/useClasses'

export const ElementWrapper = ({
  children,
  label,
  htmlFor
}) => (
  <div className={useClasses('', 'form-group row')}>
    <label htmlFor={htmlFor} className={useClasses('', 'form-label col-form-label col-sm-2')}>
      {label}
    </label>
    <div className={useClasses('', 'col-sm-10')}>
      {children}
    </div>
  </div>
)

ElementWrapper.defaultProps = {
  children: null,
  label: null,
  htmlFor: ''
}

ElementWrapper.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  htmlFor: PropTypes.string
}
