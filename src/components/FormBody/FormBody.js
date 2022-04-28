import React from 'react'
import PropTypes from 'prop-types'

import { useClasses } from '../../hooks/useClasses'
import { FormElement } from '../FormElement/FormElement'

export const FormBody = ({
  className,
  model,
  ui
}) => {
  const { elementClasses } = useClasses()

  let formBodyClassnames = 'form'

  formBodyClassnames += ` ${className}`

  return (
    <div className={elementClasses(formBodyClassnames, 'card')}>
      <div className={elementClasses('form__body', 'card-body')}>
        {
          ui.childElementCount > 0 && Array.from(ui.children).map((element) => (
            <FormElement
              key={element.outerHTML}
              element={element}
              model={model}
            />
          ))
        }
      </div>
    </div>
  )
}

FormBody.defaultProps = {
  className: null
}

FormBody.propTypes = {
  className: PropTypes.string,
  model: PropTypes.shape({}).isRequired,
  ui: PropTypes.shape({
    childElementCount: PropTypes.number,
    children: PropTypes.shape({})
  }).isRequired
}
