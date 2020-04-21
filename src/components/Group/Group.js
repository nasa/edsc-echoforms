import React from 'react'
import PropTypes from 'prop-types'

import { FormElement } from '../FormElement/FormElement'
import { useClasses } from '../../hooks/useClasses'

import './Group.css'

export const Group = ({
  children,
  id,
  label,
  model,
  modelRef,
  readOnly
}) => (
  <div
    id={id}
    className={useClasses('group', 'card')}
  >
    <div className={useClasses('group__header', 'card-header')}>
      {label}
    </div>
    <div className={useClasses('group__body', 'card-body')}>
      {
        children && Array.from(children).map((element, index) => (
          <FormElement
            // eslint-disable-next-line react/no-array-index-key
            key={`fix-this-later-${index}`}
            element={element}
            model={model}
            parentModelRef={modelRef}
            parentReadOnly={readOnly}
          />
        ))
      }
    </div>
  </div>
)

Group.defaultProps = {
  children: null,
  id: '',
  modelRef: undefined,
  readOnly: undefined
}

Group.propTypes = {
  children: PropTypes.shape({}),
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string,
  readOnly: PropTypes.bool
}
