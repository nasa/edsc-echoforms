import React, { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { EchoFormsContext } from '../../context/EchoFormsContext'
import { useClasses } from '../../hooks/useClasses'

import './Range.css'
import { Help } from '../Help/Help'

export const Range = ({
  children,
  id,
  label,
  max,
  min,
  modelRef,
  readOnly,
  required,
  step,
  value
}) => {
  const { onUpdateModel } = useContext(EchoFormsContext)
  const [position, setPosition] = useState('')
  const [newValue, setNewValue] = useState('')

  useEffect(() => {
    const newValue = Number((value - min) * 100 / (max - min))
    const newPosition = 25 - (newValue * 0.5)
    setPosition(newPosition)
    setNewValue(newValue)
  }, [value, max, min])

  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.value)
  }

  return (
    <ElementWrapper
      label={label}
    >
      <input
        className={useClasses('range__input', 'form-control-range')}
        id={id}
        max={max}
        min={min}
        name={label}
        readOnly={readOnly}
        step={step}
        type="range"
        value={value}
        onChange={onChange}
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
          {value}
        </span>
      </div>
      <Help elements={children} />
    </ElementWrapper>
  )
}

Range.defaultProps = {
  children: null,
  id: '',
  value: ''
}

Range.propTypes = {
  children: PropTypes.shape({}),
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
  min: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  step: PropTypes.string.isRequired,
  value: PropTypes.string
}
