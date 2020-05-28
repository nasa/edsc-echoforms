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
  manualError,
  manualHelp,
  model,
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
  }, [isFieldValid])

  return (
    <div className={elementClasses('', 'form-group row')}>
      <label htmlFor={htmlFor} className={elementClasses('', 'form-label col-form-label col-sm-4 text-right')}>
        {label}
      </label>
      <div className={elementClasses('', 'col-sm-8')}>
        {
          children({ isFieldValid })
        }
        <Constraint
          elements={formElements}
          setFieldIsValid={setFieldIsValid}
          manualError={manualError}
          model={model}
          required={required}
          type={type}
          value={value}
        />
        <Help elements={formElements} manualHelp={manualHelp} />
      </div>
    </div>
  )
}

ElementWrapper.defaultProps = {
  children: null,
  formElements: null,
  htmlFor: '',
  label: null,
  manualError: null,
  manualHelp: null,
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
  manualError: PropTypes.string,
  manualHelp: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  model: PropTypes.shape({}).isRequired,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ])
}
