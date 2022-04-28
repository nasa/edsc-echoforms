/**
 * Builds a namespace resolver function for the given XML
 * @param {Object} xml XML object
 */
export const buildXPathResolverFn = (xml) => {
  let match
  const namespaces = {}
  const defaultName = ' default '

  const namespaceRegex = /\sxmlns(?::(\w+))?="([^"]+)"/g
  match = namespaceRegex.exec(xml.firstChild.outerHTML)
  while (match != null) {
    const [name, uri] = Array.from(match.slice(1, 3))
    namespaces[name != null ? name : defaultName] = uri
    match = namespaceRegex.exec(xml.firstChild.outerHTML)
  }

  return (prefix) => namespaces[prefix !== null ? prefix : defaultName]
}
