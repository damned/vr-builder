/* global AFRAME clog */

AFRAME.registerComponent('letterbox', {
  schema: {type: 'string'},
  init: function() {
    let self = this
    let host = self.el
    let key
    self.update = function() {
      key = self.data
      $(`<a-text align="center" wrap-count="100" position="0 0 0.051" scale"0.2 0.2 0.2" baseline="center" value="${key}"></a-text>`).appendTo(host)
    }
    host.classList.add('letterbox')
    host.addEventListener('hitstart', (event) => {
      clog('letterbox', event.target)
      clog('letterbox', 'key: ' + key)
      host.setAttribute('color', 'white')
      setTimeout(() => host.setAttribute('color', 'gray'), 100)         
    })
  }
})