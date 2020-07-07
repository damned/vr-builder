/* global AFRAME */

AFRAME.registerComponent('typist-hand', {
  init: function() {
    let self = this
    let host = self.el
    let side = host.getAttribute('hand-side')
    let $keyboardSpace = $(host).closest('[keyboard-space]')
    $keyboardSpace.on('typestart', () => {
      host.setAttribute('follower', `leader: #${side}-hand`)
    })
    $keyboardSpace.on('typeend', () => {
      host.removeAttribute('follower')
    })
  }
})