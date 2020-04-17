import React from 'react'
import PropTypes from 'prop-types'

import { FormElement } from '../FormElement/FormElement'

import './Group.scss'

export const Group = ({
  addBootstrapClasses,
  children,
  id,
  label,
  model,
  modelRef,
  readOnly,
  required,
  onUpdateModel
}) => (
  <div
    id={id}
    // className="group--wrapper"
    className={addBootstrapClasses ? 'card group' : 'group'}
  >
    {/* <h1 className="group--label">{label}</h1> */}
    <div className={addBootstrapClasses ? 'card-header group--header' : 'group--header'}>
      {label}
    </div>
    <div className={addBootstrapClasses ? 'card-body' : ''}>
      {
        children && Array.from(children).map((element, index) => (
          <FormElement
            // eslint-disable-next-line react/no-array-index-key
            key={`fix-this-later-${index}`}
            addBootstrapClasses={addBootstrapClasses}
            element={element}
            model={model}
            parentModelRef={modelRef}
            parentReadOnly={readOnly}
            parentRequired={required}
            onUpdateModel={onUpdateModel}
          />
        ))
      }
    </div>
  </div>
)

Group.defaultProps = {
  addBootstrapClasses: false,
  children: null,
  id: '',
  modelRef: undefined,
  readOnly: undefined,
  required: undefined
}

Group.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  children: PropTypes.shape({}),
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  onUpdateModel: PropTypes.func.isRequired
}
