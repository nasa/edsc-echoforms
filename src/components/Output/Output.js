import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { evaluateXpath } from '../../util/evaluateXpath'
import { EchoFormsContext } from '../../context/EchoFormsContext'

export const Output = ({
  children,
  elementHash,
  id,
  label,
  model,
  type,
  value
}) => {
  const { resolver } = useContext(EchoFormsContext)

  // Output elements can have xpath as their value attribute.
  // Try to evaluate the value, but catch any error and use the given value
  let evaluatedValue
  try {
    evaluatedValue = evaluateXpath(value, model, resolver)
  } catch (e) {
    evaluatedValue = value
  }

  return (
    <ElementWrapper
      elementHash={elementHash}
      formElements={children}
      htmlFor={id}
      label={label}
      model={model}
    >
      {
        () => (
          <>
            {
              type === 'anyuri' && (
                <a
                  className="form-text"
                  id={id}
                  href={evaluatedValue}
                >
                  {evaluatedValue}
                </a>
              )
            }
            {
              (!type || type !== 'anyuri') && (
                <span
                  className="form-text"
                  id={id}
                >
                  {evaluatedValue}
                </span>
              )
            }
          </>
        )
      }
    </ElementWrapper>
  )
}

Output.defaultProps = {
  children: null,
  id: '',
  type: '',
  value: ''
}

Output.propTypes = {
  children: PropTypes.shape({}),
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  model: PropTypes.shape({}).isRequired,
  type: PropTypes.string,
  value: PropTypes.string
}
