import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'

export const TextArea = ({
  children,
  elementHash,
  id,
  label,
  modelRef,
  readOnly,
  required,
  value
}) => {
  const { onUpdateModel } = useContext(EchoFormsContext)
  const { elementClasses } = useClasses()

  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.value)
  }

  return (
    <ElementWrapper
      elementHash={elementHash}
      formElements={children}
      htmlFor={id}
      label={label}
      required={required}
      value={value}
    >
      {
        ({ isFieldValid }) => (
          <textarea
            className={elementClasses('textarea__input', 'form-control', !isFieldValid)}
            id={id}
            name={label}
            readOnly={readOnly}
            value={value}
            onChange={onChange}
          />
        )
      }
    </ElementWrapper>
  )
}

TextArea.defaultProps = {
  children: null,
  id: '',
  value: ''
}

TextArea.propTypes = {
  children: PropTypes.shape({}),
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string
}
