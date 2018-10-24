import winston from 'winston'
import colors from 'colors/safe'

const _colors = ['red', 'yellow', 'green', 'blue', 'magenta', 'white']

const { format } = winston

function buildFormats (label, formats) {
  formats = formats || []
  const _formats = [
    format.label({ label, message: true }),
    format.cli(),
    format.timestamp(),
    format.simple(),
    ...formats]
  return format.combine(..._formats)
}

let i = 0
module.exports = (module, level) => {
  level = level || 'debug'

  module = colors[_colors[i]](module)
  let next = (i + 1) % _colors.length
  i = next

  return (label, loggerOptions) => {
    label = label ? `${module}:${colors[_colors[next]](label)}` : module
    loggerOptions = loggerOptions || {}

    if (winston.loggers.has(label)) {
      return winston.loggers.get(label)
    }

    let defaultOptions = {
      format: buildFormats(label),
      transports: [
        new winston.transports.Console({
          level,
          timestamp: () => (new Date()).toISOString()
        })
      ]
    }

    let options = {
      ...defaultOptions,
      ...loggerOptions
    }

    return winston.loggers.add(label, options)
  }
}
