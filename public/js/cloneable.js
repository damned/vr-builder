/* global AFRAME clog catching copyPlacement applyPlacement afterCreation */

function copyableComponents(el) {
  return Object.values(el.components).filter(component => component.copyTo)
}

function copyComponentsState(source, target) {
  afterCreation(() => {
    copyableComponents(source).forEach((sourceComponent) => {
      clog('copying component', sourceComponent.name)
      sourceComponent.copyTo(target.components[sourceComponent.name]) 
    })
  })
}

function cloneEntity(entity, atSamePlace, newParent) {
  entity.flushToDOM()
  let clone = entity.cloneNode()
  clone.removeAttribute('cloneable')
  let parent = newParent || document.getElementById('spawn')
  parent.appendChild(clone)
  copyComponentsState(entity, clone)
  
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
      return cloneEntity(host, false)
    }
  }
});
