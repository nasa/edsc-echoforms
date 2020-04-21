import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'

export const TextArea = ({
  id,
  label,
  modelRef,
  readOnly,
  value
}) => {
  const { onUpdateModel } = useContext(EchoFormsContext)

  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.value)
  }

  return (
    <ElementWrapper
      htmlFor={id}
      label={label}
    >
      <textarea
        className={useClasses('textarea__input', 'form-control')}
        id={id}
        name={label}
        readOnly={readOnly}
        value={value}
        onChange={onChange}
      />
    </ElementWrapper>
  )
}

TextArea.defaultProps = {
  id: '',
  value: ''
}

TextArea.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string
}
