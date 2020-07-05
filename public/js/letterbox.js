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
    host.addEventListener('hitstart', () => {
      clog('key: ' + key)
    })
  }
})