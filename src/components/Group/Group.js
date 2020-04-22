import React from 'react'
import PropTypes from 'prop-types'

import { FormElement } from '../FormElement/FormElement'
import { useClasses } from '../../hooks/useClasses'

import './Group.css'
import { getGroupModel } from '../../util/getGroupModel'

export const Group = ({
  children,
  id,
  label,
  model,
  modelRef,
  readOnly
}) => {
  const groupModel = getGroupModel(modelRef, model)

  // react-hooks/rules-of-hooks - shouldn't call hooks inside of conditionals
  const headerClasses = useClasses('group__header', 'card-header')

  return (
    <div
      id={id}
      className={useClasses('group', 'card')}
    >
      {
        label && (
          <div className={headerClasses}>
            {label}
          </div>
        )
      }
      <div className={useClasses('group__body', 'card-body')}>
        {
          children && Array.from(children).map((element, index) => (
            <FormElement
              // eslint-disable-next-line react/no-array-index-key
              key={`fix-this-later-${index}`}
              element={element}
              model={groupModel}
              parentReadOnly={readOnly}
            />
          ))
        }
      </div>
    </div>
  )
}

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
