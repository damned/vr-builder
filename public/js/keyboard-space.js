/* global AFRAME */

AFRAME.registerComponent('keyboard-space', {
  init: function() {
    let self = this
    let host = self.el
    host.setAttribute('aabb-collider', 'objects: hand'
                      // + '; debug: true'
                     )
    host.addEventListener('hitstart', (event) => {
      host.emit('typestart')
    })
    host.addEventListener('hitend', (event) => {
      host.emit('typeend')
    })
  }
})