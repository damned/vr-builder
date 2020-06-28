/* global AFRAME clog catching copyPlacement applyPlacement */

function copyableComponents(el) {
  return Object.values(el.components).filter(component => component.copyTo)
}

function copyComponentsState(source, target) {
  
}

function cloneEntity(entity, atSamePlace) {
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

  if (atSamePlace) {
    let place = copyPlacement(entity)
    clone.addEventListener('loaded', () => applyPlacement(place, clone))    
  }
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
