/* global AFRAME clog */

AFRAME.registerComponent('letterbox', {
  schema: {type: 'string'},
  init: function() {
    let self = this
    let host = self.el
    let key
    self.update = function() {
      key = self.data
    }
    host.addClass('letterbox')
    host.addEventListener('loaded', () => {
      $(`<a-text align="center" baseline="bottom" value="${key}"></a-text>`).appendTo(host)
    })
    host.addEventListener('hitstart', () => {
      clog('key: ' + key)
      let color = host.getAttribute('color')
      host.setAttribute('color', 'white')
      setTimeout(() => host.setAttribute('color', color), 100)
    })
  }
})