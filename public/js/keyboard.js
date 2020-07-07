/* global AFRAME */

AFRAME.registerComponent('keyboard', {
  init: function() {
    let self = this
    let host = self.el
    host.setAttribute('aabb-collider', 'objects: hand')
    host.addEventListener('hitstart', (event) => {
      host.emit()
    })
  }
})