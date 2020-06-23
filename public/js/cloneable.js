/* global AFRAME */

AFRAME.registerComponent('cloneable', {
  init: function() {
    let self = this
    let host = self.el
    function copyableComponents() {
      return host.components.map(component => component.copyTo ?)
    }
    self.clone = function() {
      let clone = this.el.cloneNode()
      clone.removeAttribute('cloneable')
      document.getElementById('spawn').appendChild(clone)
      return clone
    }
  }
});
