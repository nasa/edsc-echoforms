/**
 * Returns the value of an XML attribute, or null if it does not exist
 * @param {Object} attributes NamedNodeMap of XML element's attributes
 * @param {String} name Name of attribute to lookup
 */
export const getAttribute = (attributes, name) => {
  const attribute = attributes.getNamedItem(name)

  if (!attribute) return null

  return attribute.value
}
