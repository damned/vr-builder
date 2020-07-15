/* global AFRAME */
AFRAME.registerComponent('move-handles', {
  schema: {
    extent: {type: 'number', default: 5 },
    gap: {type: 'number', default: 1 },
    height: {type: 'number', default: 1 }
  },
  init: function() {
    let self = this
    let host = self.el
    
    let handleCount
    let extent
    let gap
    let offset
    let height
    
    self.update = () => {
      extent = self.data.extent
      gap = self.data.gap
      height = self.data.height
      offset = -Math.floor(extent / 2) * gap
        
      // todo: move some of this to move-handle
      handleCount = extent * extent
      for (let i = 0; i < handleCount; i++) {
        $('<a-box><a-image user-move-handle opacity="0.15" rotation="90 0 0" width="0.2" height="0.2" src="#four-way-arrow"></a-image><a-box>').appendTo(host)
      }
      host.setAttribute('layout', `type: box; columns: ${extent}; margin: ${gap}; plane: xz`)
      host.setAttribute('position', `${offset} ${height} ${offset}`)
    }
  },
})