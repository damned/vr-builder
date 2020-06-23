/* global AFRAME clog catching */

function copyableComponents(el) {
  return Object.values(el.components).filter(component => component.copyTo)
}

function cloneEntity(entity) {
  entity.flushToDOM()
  let clone = entity.cloneNode()
  entity.setAttribute('color', 'white')
  clone.removeAttribute('cloneable')
  document.getElementById('spawn').appendChild(clone)
  setTimeout(() => {
    catching(() => {
      copyableComponents(entity).forEach((sourceComponent) => {
        clog('copying component', sourceComponent.name)
        sourceComponent.copyTo(clone.components[sourceComponent.name]) 
      })
    })
  }, 0)
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
