import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { evaluateXpath } from '../../util/evaluateXpath'
import { EchoFormsContext } from '../../context/EchoFormsContext'
import { useClasses } from '../../hooks/useClasses'

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
  const { elementClasses } = useClasses()

  // Output elements can have xpath as their value attribute.
  // Try to evaluate the value, but catch any error and use the given value
  let evaluatedValue = value

  try {
    evaluatedValue = evaluateXpath(value, model, resolver)

    // If no result was found from evaluating the xpath, default to original value
    if (evaluatedValue == null) {
      evaluatedValue = value
    }
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
                  className={elementClasses('', 'd-block form-text link')}
                  id={id}
                  href={evaluatedValue}
                >
                  {evaluatedValue}
                </a>
              )
            }
            {
              (!type || type !== 'anyuri') && (
                <p
                  className="form-text mb-0"
                  id={id}
                >
                  {evaluatedValue}
                </p>
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
