/* global AFRAME clog */

function copyableComponents(el) {
  return el.components.filter(component => component.copyTo)
}

function cloneEntity(entity) {
  let clone = entity.cloneNode()
  clone.removeAttribute('cloneable')
  document.getElementById('spawn').appendChild(clone)
  setTimeout(() => 
    copyableComponents(entity).forEach((sourceComponent) => {
      clog('copying component', sourceComponent.name)
      sourceComponent.copyTo(clone.components[sourceComponent.name]) 
    }), 0)
  return clone  
}

AFRAME.registerComponent('cloneable', {
  init: function() {
    let self = this
    let host = self.el
    self.clone = function() {
      return cloneEntity(host)
    }
  }
});
