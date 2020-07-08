/* global AFRAME clog */

AFRAME.registerComponent('keyboard', {
  init: function() {
    let self = this
    let host = self.el
    host.addEventListener('keydown')
  }
})