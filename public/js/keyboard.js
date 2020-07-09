/* global AFRAME clog */

AFRAME.registerComponent('keyboard', {
  init: function() {
    let self = this
    let host = self.el
    let startY = host.getAttribute('position').y
    
    host.addEventListener('keydown', (event) => {
      clog('keyboard', 'keydown event target', event.target)
      let 
    })
    host.addEventListener('keyup', (event) => {
      clog('keyboard', 'keyup event target', event.target)
    })
    self.tick(() => {
      host.
    })
  }
})