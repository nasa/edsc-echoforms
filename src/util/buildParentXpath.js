/**
 * Concatenates a parent xPath and child xPath, unless the child xPath is absolute
 * @param {String} parentXpath
 * @param {String} xpath
 */
export const buildParentXpath = (parentXpath, xpath) => {
  let parentWithChildXpath = xpath

  if (parentXpath && !xpath.startsWith('/')) {
    parentWithChildXpath = `${parentXpath}/${xpath}`
  }

  return parentWithChildXpath
}
