/* global AFRAME */

AFRAME.registerComponent('cloneable', {
  init: function() {
    this.dragger = null
    this.updateCount = 0
    this.tickCount = 0
  },
  clone: function() {
    let clone = this.el.cloneNode()
    clone.removeAttribute('cloneable')
    document.getElementById('spawn').appendChild(clone)
    return clone
  }
});
