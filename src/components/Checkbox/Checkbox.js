import React from 'react'
import PropTypes from 'prop-types'
import { Form, Col, Row } from 'react-bootstrap'

export const Checkbox = ({
  checked,
  label,
  modelRef,
  readOnly,
  onUpdateModel
}) => {
  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.checked)
  }

  return (
    <Form.Group controlId={label} as={Row}>
      <Col sm={2} />
      <Col sm={10}>
        <Form.Check
          checked={checked === 'true'}
          label={label}
          name={label}
          readOnly={readOnly}
          type="checkbox"
          onChange={onChange}
        />
      </Col>
    </Form.Group>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  modelRef: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  onUpdateModel: PropTypes.func.isRequired
}
