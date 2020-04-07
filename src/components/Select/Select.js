import React from 'react'
import PropTypes from 'prop-types'
import { ElementWrapper } from '../ElementWrapper/ElementWrapper'
import { getAttribute } from '../../util/getAttribute'

export const Select = ({
  addBootstrapClasses,
  children,
  id,
  label,
  modelRef,
  multiple,
  readOnly,
  value,
  valueElementName,
  onUpdateModel
}) => {
  const onChange = (e) => {
    // Map e.target.selectedOptions to an array of objects with the value and valueElementName
    const { selectedOptions } = e.target

    const values = []
    Array.from(selectedOptions).forEach((option) => {
      const { value } = option
      values.push({ value, valueElementName })
    })

    onUpdateModel(modelRef, values)
  }

  return (
    <ElementWrapper
      addBootstrapClasses={addBootstrapClasses}
      label={label}
    >
      <select
        className={addBootstrapClasses ? 'form-check-input' : ''}
        id={id}
        name={label}
        multiple={multiple}
        readOnly={readOnly}
        value={multiple ? value : value[0]}
        onChange={onChange}
      >
        {
          children && Array.from(children).map((child) => {
            const { attributes, tagName } = child

            if (tagName === 'item') {
              const optionLabel = getAttribute(attributes, 'label')
              const optionValue = getAttribute(attributes, 'value')
              return (
                <option
                  key={`option-${optionValue}`}
                  value={optionValue}
                >
                  {optionLabel}
                </option>
              )
            }
            // if (tagName === 'help')

            return null
          })
        }
      </select>
    </ElementWrapper>
  )
}

Select.defaultProps = {
  addBootstrapClasses: false,
  children: null,
  id: '',
  label: '',
  multiple: false,
  value: [],
  valueElementName: ''
}

Select.propTypes = {
  addBootstrapClasses: PropTypes.bool,
  children: PropTypes.shape({}),
  id: PropTypes.string,
  label: PropTypes.string,
  modelRef: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  valueElementName: PropTypes.string,
  onUpdateModel: PropTypes.func.isRequired
}
