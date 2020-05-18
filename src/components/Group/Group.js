import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { FormElement } from '../FormElement/FormElement'
import { Help } from '../Help/Help'
import { useClasses } from '../../hooks/useClasses'
import { evaluateXpath } from '../../util/evaluateXpath'
import { EchoFormsContext } from '../../context/EchoFormsContext'

import './Group.css'

export const Group = ({
  children,
  id,
  label,
  model,
  modelRef,
  readOnly
}) => {
  const { resolver } = useContext(EchoFormsContext)
  const { elementClasses } = useClasses()
  const groupModel = evaluateXpath(modelRef, model, resolver)

  // react-hooks/rules-of-hooks - shouldn't call hooks inside of conditionals
  const headerClasses = elementClasses('group__header', 'card-header')

  return (
    <div
      id={id}
      className={elementClasses('group', 'card')}
    >
      {
        label && (
          <div className={headerClasses}>
            {label}
            <Help elements={children} />
          </div>
        )
      }
      <div className={elementClasses('group__body', 'card-body')}>
        {
          children && Array.from(children)
            .filter(element => element.tagName !== 'help')
            .map((element, index) => (
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
