/**
 * Validates a string value is a ISO DateTime
 * @param {String} value
 */
export const validateDateTime = (value) => {
  // Don't show an error if there is no value
  if (!value) return true

  if (!value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
    return false
  }

  const [date, time] = Array.from(value.split('T'))
  const [year, month, day] = date.split('-').map(x => parseInt(x, 10))
  const [hour, minute, second] = time.split(':').map(x => parseInt(x, 10))

  return (
    year
    && (month >= 1 && month <= 12)
    && (day >= 1 && day <= 31)
    && (hour < 24)
    && (minute < 60)
    && (second < 60)
  )
}
