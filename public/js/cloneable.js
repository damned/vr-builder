/* global AFRAME clog */

AFRAME.registerComponent('cloneable', {
  init: function() {
    let self = this
    let host = self.el
    function copyableComponents(el) {
      return el.components.filter(component => component.copyTo)
    }
    self.clone = function() {
      let clone = this.el.cloneNode()
      clone.removeAttribute('cloneable')
      document.getElementById('spawn').appendChild(clone)
      setTimeout(() => 
        copyableComponents(host).forEach((sourceComponent) => {
          clog('copying component', sourceComponent.name)
          sourceComponent.copyTo(clone.components[sourceComponent.name]) 
        }), 0)
      return clone
    }
  }
});
