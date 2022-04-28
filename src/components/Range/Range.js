import React, { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { EchoFormsContext } from '../../context/EchoFormsContext'
import { useClasses } from '../../hooks/useClasses'

import './Range.css'

export const Range = ({
  children,
  elementHash,
  id,
  label,
  max,
  min,
  model,
  modelRef,
  parentRef,
  readOnly,
  required,
  step,
  value: propsValue
}) => {
  const { onUpdateModel } = useContext(EchoFormsContext)

  const [value, setValue] = useState(propsValue)
  const [position, setPosition] = useState('')
  const [newValue, setNewValue] = useState('')
  const { elementClasses } = useClasses()

  // When the value from props changes, update the state value that drives the input
  useEffect(() => {
    setValue(propsValue)
  }, [propsValue])

  useEffect(() => {
    let safeValue = value
    if (!value) safeValue = min
    const newValue = (Number((safeValue - min) * 100) / (max - min))
    const newPosition = 25 - (newValue * 0.5)
    setPosition(newPosition)
    setNewValue(newValue)
  }, [value, max, min])

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const updateModel = (e) => {
    onUpdateModel(parentRef, modelRef, e.target.value)
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
          <>
            <input
              className={elementClasses('range__input', 'form-control-range', !isFieldValid)}
              id={id}
              max={max}
              min={min}
              name={label}
              readOnly={readOnly}
              step={step}
              type="range"
              value={value || min}
              onChange={onChange}
              onMouseUp={updateModel}
              onKeyUp={updateModel}
            />
            <div className="range__markers">
              <span className="range__min">
                {min}
              </span>
              <span className="range__max">
                {max}
              </span>
            </div>
            <div
              className="range__value"
              style={{ left: `calc(${newValue}% + (${position}px))` }}
            >
              <span>
                {value || min}
              </span>
            </div>
          </>
        )
      }
    </ElementWrapper>
  )
}

Range.defaultProps = {
  children: null,
  id: '',
  parentRef: null,
  value: ''
}

Range.propTypes = {
  children: PropTypes.shape({}),
  elementHash: PropTypes.number.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
  min: PropTypes.string.isRequired,
  model: PropTypes.shape({}).isRequired,
  modelRef: PropTypes.string.isRequired,
  parentRef: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  step: PropTypes.string.isRequired,
  value: PropTypes.string
}
