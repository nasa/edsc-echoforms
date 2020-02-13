import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'react-bootstrap'

export const TextArea = ({
  id,
  label,
  modelRef,
  readOnly,
  value,
  onUpdateModel
}) => {
  const onChange = (e) => {
    onUpdateModel(modelRef, e.target.value)
  }

  return (
    <Form.Group as={Row}>
      <Form.Label column sm={2}>
        {label}
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          as="textarea"
          id={id}
          name={label}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
        />
      </Col>
    </Form.Group>
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
  value: PropTypes.string,
  onUpdateModel: PropTypes.func.isRequired
}
