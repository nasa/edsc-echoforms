import React, { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'
import { Constraint } from '../Constraint/Constraint'
import { Help } from '../Help/Help'

export const ElementWrapper = ({
  children,
  elementHash,
  formElements,
  htmlFor,
  label,
  required,
  type,
  value
}) => {
  const { setFormIsValid } = useContext(EchoFormsContext)
  const [isFieldValid, setFieldIsValid] = useState(true)
  const { elementClasses } = useClasses()

  // When isFieldValid changes, call setFormIsValid to update this field with the new value
  useEffect(() => {
    setFormIsValid(prevState => ({ ...prevState, [elementHash]: isFieldValid }))
  }, [elementHash, isFieldValid, setFormIsValid])

  return (
    <div className={elementClasses('', 'form-group row')}>
      <label htmlFor={htmlFor} className={elementClasses('', 'form-label col-form-label col-sm-2')}>
        {label}
      </label>
      <div className={elementClasses('', 'col-sm-10')}>
        {
          children({ isFieldValid })
        }
        <Constraint
          elements={formElements}
          setFieldIsValid={setFieldIsValid}
          required={required}
          type={type}
          value={value}
        />
        <Help elements={formElements} />
      </div>
    </div>
  )
}

ElementWrapper.defaultProps = {
  children: null,
  formElements: null,
  htmlFor: '',
  label: null,
  required: false,
  type: null,
  value: null
}

ElementWrapper.propTypes = {
  children: PropTypes.func,
  elementHash: PropTypes.number.isRequired,
  formElements: PropTypes.shape({}),
  htmlFor: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ])
}
