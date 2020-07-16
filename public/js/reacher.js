/* global AFRAME THREE clog */

AFRAME.registerComponent('reacher', {
  schema: {
    componentsToPlay: {type: 'array'},
    distance: {type: 'number', default}
  },

  init: function() {
    let self = this
    let host = self.el
    let componentsToPlay
    
    self.update(() => {
      componentsToPlay = self.data.componentsToPlay
    })
    self.tick(() => {
      let distance
    })
  }
})
