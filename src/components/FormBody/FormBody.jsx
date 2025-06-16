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

  /**
   * Prevents form submission when Enter is pressed on any form element
   * @param {Object} keyPressEvent event object
   */
  const onKeyDown = (keyPressEvent) => {
    if (keyPressEvent.key === 'Enter') {
      keyPressEvent.preventDefault()
    }
  }

  formBodyClassnames += ` ${className}`

  return (
    // Disabling this rule because we want to capture events from bubbling up
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={elementClasses(formBodyClassnames, 'card')}
      onKeyDown={onKeyDown}
    >
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
