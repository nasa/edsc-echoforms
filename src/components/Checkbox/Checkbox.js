import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

export const Checkbox = ({
  checked,
  label,
  modelRef,
  onUpdateModel
}) => {
  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.checked)
  }

  return (
    <Form.Group controlId={label}>
      <Form.Check
        checked={checked === 'true'}
        label={label}
        name={label}
        type="checkbox"
        onChange={onChange}
      />
    </Form.Group>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  onUpdateModel: PropTypes.func.isRequired
}
