import React, {
  useContext,
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { useClasses } from '../../hooks/useClasses'
import { EchoFormsContext } from '../../context/EchoFormsContext'

export const TextArea = ({
  children,
  elementHash,
  id,
  label,
  model,
  modelRef,
  parentRef,
  readOnly,
  required,
  value
}) => {
  const [stateValue, setStateValue] = useState(value)
  const { onUpdateModel } = useContext(EchoFormsContext)
  const { elementClasses } = useClasses()

  // When the value from props changes, update the state value that drives the text area
  useEffect(() => {
    setStateValue(value)
  }, [value])

  const onBlur = () => {
    onUpdateModel(parentRef, modelRef, stateValue)
  }

  const onChange = (e) => {
    setStateValue(e.target.value)
  }

  return (
    <ElementWrapper
      elementHash={elementHash}
      formElements={children}
      htmlFor={id}
      label={label}
      model={model}
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
            value={stateValue}
            onBlur={onBlur}
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
  parentRef: null,
  value: ''
}

TextArea.propTypes = {
  children: PropTypes.shape({}),
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string.isRequired,
  parentRef: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string
}
