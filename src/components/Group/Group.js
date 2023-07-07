import React, { useContext } from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line import/no-cycle
import { FormElement } from '../FormElement/FormElement'
import { Help } from '../Help/Help'

import { useClasses } from '../../hooks/useClasses'

import { evaluateXpath } from '../../util/evaluateXpath'
import { buildParentXpath } from '../../util/buildParentXpath'

import { EchoFormsContext } from '../../context/EchoFormsContext'

import './Group.css'

export const Group = ({
  children,
  id,
  label,
  model,
  modelRef,
  parentRef,
  readOnly
}) => {
  const { resolver } = useContext(EchoFormsContext)
  const { elementClasses } = useClasses()
  const groupModel = evaluateXpath(modelRef, model, resolver)

  // `react-hooks/rules-of-hooks` - shouldn't call hooks inside of conditionals
  const headerClasses = elementClasses('group__header', 'card-header')

  const newParentRef = buildParentXpath(parentRef, modelRef)

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
            .filter((element) => element.tagName !== 'help')
            .map((element) => (
              <FormElement
                key={element.outerHTML}
                element={element}
                model={groupModel}
                parentReadOnly={readOnly}
                parentRef={newParentRef}
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
  label: '',
  modelRef: undefined,
  parentRef: null,
  readOnly: undefined
}

Group.propTypes = {
  children: PropTypes.shape({}),
  id: PropTypes.string,
  label: PropTypes.string,
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string,
  parentRef: PropTypes.string,
  readOnly: PropTypes.bool
}
