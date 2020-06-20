function patchHtmlProperty(html, name, value) {
  let pattern = `${name}="[^"]*"`
  return html.replace(new RegExp(pattern, 'g'), `${name}="${value}"`)
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

