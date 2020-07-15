/* global AFRAME */
AFRAME.registerComponent('move-handles', {
  schema: {
    extent: {type: 'number', default: 5 },
    gap: {type: 'number', default: 1 }
  },
  init: function() {
    let self = this
    let host = self.el
    
    let handleCount
    let extent
    let gap
    let offset
    
    self.update = () => {
      extent = self.data.extent
      gap = self.data.gap
      offset = -Math.floor(extent / 2) * gap
        
      handleCount = extent * extent
      for (let i = 0; i < handleCount; i++) {
        $('<a-box opacity="0.2" mixin="movehandle"></a-box>').appendTo(host)
      }
      host.setAttribute('layout', `type: box; columns: ${extent}; margin: ${gap}; plane: xz`)
      host.setAttribute('position', `${offset} 1 ${offset}`)
    }
  },
})