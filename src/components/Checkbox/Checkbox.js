import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'

export const Checkbox = ({
  checked,
  id,
  label,
  modelRef,
  readOnly
}) => {
  const { onUpdateModel } = useContext(EchoFormsContext)

  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.checked)
  }

  return (
    <ElementWrapper
      htmlFor={id}
      label={label}
    >
      <>
        <input
          className={useClasses('checkbox__input', 'form-check-input')}
          checked={checked === 'true'}
          id={id}
          name={label}
          readOnly={readOnly}
          type="checkbox"
          onChange={onChange}
        />
        <label
          className={useClasses('checkbox__label', 'form-check-label')}
          htmlFor={id}
        >
          {label}
        </label>
      </>
    </ElementWrapper>
  )
}

Checkbox.defaultProps = {
  id: '',
  label: ''
}

Checkbox.propTypes = {
  checked: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired
}
