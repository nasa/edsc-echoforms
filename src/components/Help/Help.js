import React from 'react'
import PropTypes from 'prop-types'

import { useClasses } from '../../hooks/useClasses'

export const Help = ({ elements }) => {
  const classes = useClasses('help-text', 'form-text text-muted')

  return (
    elements && Array.from(elements)
      .filter(element => element.tagName === 'help')
      .map(element => (
        <small
          key={`help-${element.id}`}
          className={classes}
        >
          {element.textContent}
        </small>
      ))
  )
}

Help.defaultProps = {
  elements: {}
}

Help.propTypes = {
  elements: PropTypes.shape({})
}
