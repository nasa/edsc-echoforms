import React from 'react'
import PropTypes from 'prop-types'

import { useClasses } from '../../hooks/useClasses'

export const Help = ({ elements, manualHelp }) => {
  const { elementClasses } = useClasses()
  const classes = elementClasses('help-text', 'form-text text-muted')

  const help = []
  if (elements) {
    Array.from(elements)
      .filter(element => element.tagName === 'help')
      .forEach((element) => {
        const { textContent } = element

        help.push((
          <small
            key={textContent}
            className={classes}
          >
            {textContent}
          </small>
        ))
      })
  }

  if (manualHelp) {
    help.push((
      <small
        key={manualHelp}
        className={classes}
      >
        {manualHelp}
      </small>
    ))
  }

  return (
    <>
      {help}
    </>
  )
}

Help.defaultProps = {
  elements: {},
  manualHelp: null
}

Help.propTypes = {
  elements: PropTypes.shape({}),
  manualHelp: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
}
