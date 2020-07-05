/* global AFRAME clog */

AFRAME.registerComponent('letterbox', {
  schema: {type: 'string'},
  init: function() {
    let self = this
    let host = self.el
    let key
    self.update = function() {
      key = self.data
      $(host).append(`<a-text align="center" baseline="bottom" value="${key}"></a-text>`)
    }
    host.classList.add('letterbox')
    host.addEventListener('hitstart', () => {
      clog('key: ' + key)
      host.setAttribute('color', 'white')
      setTimeout(() => host.setAttribute('color', 'gray'), 100)
    })
  }
})