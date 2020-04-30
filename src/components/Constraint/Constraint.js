import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { EchoFormsContext } from '../../context/EchoFormsContext'

import { evaluateXpath } from '../../util/evaluateXpath'
import { typeValidation } from '../../util/validations/typeValidation'

export const Constraint = ({
  elements,
  required,
  type,
  value,
  setFieldIsValid
}) => {
  const { model } = useContext(EchoFormsContext)

  if (!elements) return null

  const errors = []
  // Run any constraint validations
  Array.from(elements)
    .filter(element => element.tagName === 'constraints')
    .forEach((element) => {
      const { children: constraints } = element

      Array.from(constraints)
        .filter(element => element.tagName === 'constraint')
        .forEach((constraint) => {
          const { children: constraintElements } = constraint

          const xpath = Array.from(constraintElements).filter(element => element.tagName === 'xpath')[0]
          const pattern = Array.from(constraintElements).filter(element => element.tagName === 'pattern')[0]
          const alert = Array.from(constraintElements).filter(element => element.tagName === 'alert')[0]

          if (xpath && !evaluateXpath(xpath.textContent, model)) {
            errors.push(alert.textContent)
          }
          if (pattern) {
            const regexResult = RegExp(pattern.textContent).exec(value)
            if (regexResult === null) errors.push(alert.textContent)
          }
        })
    })

  // Run basic validations
  errors.push(typeValidation(type, value))

  // Is the field required and empty?
  if (required && !value) {
    errors.push('Required field')
  }

  const filteredErrors = errors.filter(error => error !== true)

  setFieldIsValid(filteredErrors.length === 0)

  return filteredErrors.map(error => (
    <div key={error} className="invalid-feedback">
      {error}
    </div>
  ))
}

Constraint.defaultProps = {
  elements: {},
  type: null,
  value: null
}

Constraint.propTypes = {
  elements: PropTypes.shape({}),
  required: PropTypes.bool.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  setFieldIsValid: PropTypes.func.isRequired
}
