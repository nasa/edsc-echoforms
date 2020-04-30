import React from 'react'
import PropTypes from 'prop-types'

import { useClasses } from '../../hooks/useClasses'

export const Help = ({ elements }) => {
  const { elementClasses } = useClasses()
  const classes = elementClasses('help-text', 'form-text text-muted')

  return (
    elements && Array.from(elements)
      .filter(element => element.tagName === 'help')
      .map((element) => {
        const { textContent } = element

        return (
          <small
            key={textContent}
            className={classes}
          >
            {textContent}
          </small>
        )
      })
  )
}

Help.defaultProps = {
  elements: {}
}

Help.propTypes = {
  elements: PropTypes.shape({})
}
