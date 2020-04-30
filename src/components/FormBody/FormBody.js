import React from 'react'
import PropTypes from 'prop-types'

import { useClasses } from '../../hooks/useClasses'
import { FormElement } from '../FormElement/FormElement'

export const FormBody = ({
  model,
  ui
}) => {
  const { elementClasses } = useClasses()

  return (
    <div className={elementClasses('form', 'card')}>
      <div className={elementClasses('form__body', 'card-body')}>
        {
          ui.childElementCount > 0 && Array.from(ui.children).map((element, i) => (
            <FormElement
              // eslint-disable-next-line react/no-array-index-key
              key={`fix-this-later-${i}`}
              element={element}
              model={model}
            />
          ))
        }
      </div>
    </div>
  )
}

FormBody.propTypes = {
  model: PropTypes.shape({}).isRequired,
  ui: PropTypes.shape({
    childElementCount: PropTypes.number,
    children: PropTypes.shape({})
  }).isRequired
}
