const io = require('@actions/io')
const fetch = require('node-fetch')
const fs = require('fs')

let injectRemoteFile = async function (
  url,
  target,
  input_pattern = '',
  force = true
) {
  const url_parts = url.match(
    /^(https?):\/\/[^/$]+\/?($|(([^/]+\/)*([^$.?]+)(\.\w+)*(\?(.)*)?$))/i
  )

  if (!url_parts || !url_parts[1])
    throw Error('Please ensure your url is a valid http(s) url')

  if (!input_pattern && !url_parts[5])
    throw Error('Could not detect a pattern, please specify it manually')

  if (!fs.existsSync(target))
    throw Error('Please ensure your target file already exists')

  const pattern_text =
    input_pattern || `<!-- auto-${url_parts[5].toLowerCase()} -->`

  const pattern_regex = new RegExp(
    `(${pattern_text})[\\s\\S]*${pattern_text}`,
    'i'
  )
  const target_content = fs.readFileSync(target, 'utf8')

  return fetch(url)
    .then((res) => res.text())
    .then((partial_content) => {
      // Remove any existing match of the pattern in the partial
      let new_partial_content = partial_content.replace(
        RegExp(pattern_text, 'ig'),
        ''
      )

      // Add the pattern at the begining and at the end of the partial
      new_partial_content =
        pattern_text + '\n' + new_partial_content + '\n' + pattern_text

      let new_target_content

      if (!pattern_regex.test(target_content) && force == true) {
        new_target_content = target_content + '\n' + new_partial_content
      } else {
        new_target_content = target_content.replace(
          pattern_regex,
          new_partial_content
        )
      }

      if (target_content == new_target_content) return [pattern_text, '']
      else {
        fs.writeFileSync(target, new_target_content)

        return [pattern_text, target]
      }
    })
}

module.exports = injectRemoteFile
