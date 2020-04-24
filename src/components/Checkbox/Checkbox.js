import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'
import { Help } from '../Help/Help'

export const Checkbox = ({
  checked,
  children,
  id,
  label,
  modelRef,
  readOnly,
  required
}) => {
  const { onUpdateModel } = useContext(EchoFormsContext)

  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.checked)
  }

  let isInvalid = false
  let errorMessage
  if (required && !(checked === 'true' || checked === 'false')) {
    isInvalid = true
    errorMessage = 'Required field'
  }

  return (
    <ElementWrapper
      htmlFor={id}
      label={label}
    >
      <>
        <input
          className={useClasses('checkbox__input', 'form-check-input', isInvalid)}
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
        {
          isInvalid && (
            <div className="invalid-feedback">
              {errorMessage}
            </div>
          )
        }
        <Help elements={children} />
      </>
    </ElementWrapper>
  )
}

Checkbox.defaultProps = {
  children: null,
  id: '',
  label: ''
}

Checkbox.propTypes = {
  checked: PropTypes.string.isRequired,
  children: PropTypes.shape({}),
  id: PropTypes.string,
  label: PropTypes.string,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired
}
