/* global AFRAME clog */

AFRAME.registerComponent('keyboard', {
  init: function() {
    let self = this
    let host = self.el
    host.addEventListener('keydown', (event) => {
      clog('keyboard', 'keydown event target', event.target)
      clog('keyboard', 'keydown event detail', event.detail)
    })
    host.addEventListener('keyup', (event) => {
      clog('keyboard', 'keyup event target', event.target)
      clog('keyboard', 'keyup event detail', event.detail)
    })
  }
})