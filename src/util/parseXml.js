/**
 * Parses a string into an XML object
 * @param {String} string XML string
 */
export const parseXml = (string) => {
  let xml
  try {
    if (window.DOMParser) {
      xml = new DOMParser().parseFromString(string, 'text/xml')
    } else {
      xml = new ActiveXObject('Microsoft.XMLDOM')
      xml.async = false
      xml.loadXML(string)
    }
  } catch (error) {}

  if (!xml || !xml.documentElement || xml.getElementsByTagName('parsererror').length) {
    console.error(`Invalid XML: ${string}`)
  }

  return xml
}
