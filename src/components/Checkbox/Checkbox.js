import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'

export const Checkbox = ({
  checked,
  children,
  elementHash,
  id,
  label,
  model,
  modelRef,
  parentRef,
  readOnly,
  required
}) => {
  const { hasShapefile, onUpdateModel } = useContext(EchoFormsContext)
  const { elementClasses } = useClasses()

  const onChange = (e) => {
    onUpdateModel(parentRef, modelRef, e.target.checked)
  }

  let disabled = false
  let shapefileHelp
  if (id && id.includes('use-shapefile')) {
    if (hasShapefile) {
      shapefileHelp = 'Complex shapefiles may take longer to process. You will receive an email when your files are finished processing.'
    } else {
      disabled = true
      shapefileHelp = (
        <span>
          Click
          {' '}
          <b>Back to Search</b>
          {' '}
          and upload a KML or Shapefile to enable this option.
        </span>
      )
    }
  }

  return (
    <ElementWrapper
      elementHash={elementHash}
      formElements={children}
      htmlFor={id}
      manualHelp={shapefileHelp}
      model={model}
      required={required}
      value={checked}
    >
      {
        ({ isFieldValid }) => (
          <>
            <input
              className={elementClasses('checkbox__input', 'form-check-input', !isFieldValid)}
              checked={checked === 'true'}
              disabled={disabled}
              id={id}
              name={label}
              readOnly={readOnly}
              type="checkbox"
              onChange={onChange}
            />
            <label
              className={elementClasses('checkbox__label', 'form-check-label')}
              htmlFor={id}
            >
              {label}
            </label>
          </>
        )
      }
    </ElementWrapper>
  )
}

Checkbox.defaultProps = {
  children: null,
  id: '',
  label: '',
  parentRef: null
}

Checkbox.propTypes = {
  checked: PropTypes.string.isRequired,
  children: PropTypes.shape({}),
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string.isRequired,
  parentRef: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired
}
