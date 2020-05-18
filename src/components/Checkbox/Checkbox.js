import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'

export const Checkbox = ({
  checked,
  children,
  elementHash,
  id,
  label,
  model,
  modelRef,
  readOnly,
  required
}) => {
  const { onUpdateModel } = useContext(EchoFormsContext)
  const { elementClasses } = useClasses()

  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.checked)
  }

  return (
    <ElementWrapper
      elementHash={elementHash}
      formElements={children}
      htmlFor={id}
      label={label}
      model={model}
      required={required}
      value={checked}
    >
      {
        ({ isFieldValid }) => (
          <>
            <input
              className={elementClasses('checkbox__input', 'form-check-input', !isFieldValid)}
              checked={checked === 'true'}
              id={id}
              name={label}
              readOnly={readOnly}
              type="checkbox"
              onChange={onChange}
            />
            <label
              className={elementClasses('checkbox__label', 'form-check-label')}
              htmlFor={id}
            >
              {label}
            </label>
          </>
        )
      }
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
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired
}
