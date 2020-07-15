/* global AFRAME */
AFRAME.registerComponent('move-handles', {
  schema: {
    extent: {type: 'number', default: 5 }
  },
  init: function() {
    let self = this
    let host = self.el
    let handleCount
    self.update = () => {
      handleCount = self.data.extent * self.data.extent
      for (let i = 0; i < handleCount; i++) {
        $('<a-box opacity="0.2" mixin="movehandle"></a-box>').appendTo(host)
      }
    }
  },
})