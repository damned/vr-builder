function addHtmlProperty(html, name, value) {
  return html.replace
}

function patchHtmlProperty(html, name, value) {
  let pattern = `${name}="[^"]*"`
  let replacedCount = 0
  let replacement = () => {
    replacedCount ++
    return `${name}="${value}"`
  } 
  let patched = html.replace(new RegExp(pattern, 'g'), replacement)
  if (replacedCount > 0) {
    return patched
  }
  return addHtmlProperty(html, name, value)
}

function patchHtml(html, props) {
  let patched = html
  for (let name in props) {
    patched = patchHtmlProperty(patched, name, props[name])
  }
  return patched
}

function uniqueId(prefix) {
  return prefix + new Date().getTime() 
}

