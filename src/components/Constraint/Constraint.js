import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

import { evaluateXpath } from '../../util/evaluateXpath'
import { typeValidation } from '../../util/validations/typeValidation'
import { EchoFormsContext } from '../../context/EchoFormsContext'

export const Constraint = ({
  elements,
  manualError,
  model,
  required,
  type,
  value,
  setFieldIsValid
}) => {
  const { resolver } = useContext(EchoFormsContext)
  if (!elements) return null

  const errors = []

  // Add any manual error passed in as a prop (e.g. maxParameters tree error)
  if (manualError) errors.push(manualError)

  // Run any constraint validations
  Array.from(elements)
    .filter((element) => element.tagName === 'constraints')
    .forEach((element) => {
      const { children: constraints } = element

      Array.from(constraints)
        .filter((element) => element.tagName === 'constraint')
        .forEach((constraint) => {
          const { children: constraintElements } = constraint

          const xpath = Array.from(constraintElements).filter((element) => element.tagName === 'xpath')[0]
          const pattern = Array.from(constraintElements).filter((element) => element.tagName === 'pattern')[0]
          const alert = Array.from(constraintElements).filter((element) => element.tagName === 'alert')[0]

          if (xpath && !evaluateXpath(xpath.textContent, model, resolver)) {
            errors.push(alert.textContent)
          }
          if (pattern) {
            const regexResult = RegExp(pattern.textContent).exec(value)
            if (regexResult === null) errors.push(alert.textContent)
          }
        })
    })

  // Run basic validations
  const typeValid = typeValidation(type, value)
  if (typeValid !== true) errors.push(typeValid)

  // Is the field required and empty?
  if (required && (!value || !value.length)) {
    errors.push('Required field')
  }

  useEffect(() => {
    setFieldIsValid(!errors.length)
  }, [errors.length])

  return errors.map((error) => (
    <div key={error} className="invalid-feedback">
      {error}
    </div>
  ))
}

Constraint.defaultProps = {
  elements: {},
  manualError: null,
  type: null,
  value: null
}

Constraint.propTypes = {
  elements: PropTypes.shape({}),
  manualError: PropTypes.string,
  model: PropTypes.shape({}).isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  setFieldIsValid: PropTypes.func.isRequired
}
