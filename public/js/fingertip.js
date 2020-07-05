/* global AFRAME */

AFRAME.registerComponent('fingertip', {
  init: function() {
    let self = this
    let host = self.el

    host.setAttribute('aabb-collider', 'objects: .letterbox;' 
                         // + '; debug: true'
                         )
  }
})