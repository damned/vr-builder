/* global AFRAME */
AFRAME.registerComponent('monitor-home', {
  schema: {type: 'string', default: 'x'},
  init: function() {
  },
  update: function(oldData) {
    let side = this.data
    console.log('this.data (side)', side)
    let direction = (side == 'left') ? -1 : 1
    let $self = $(this.el)
    let createMonitor = (scale, offset, dynamic, wrapCount) => {
      return $(`<a-box monitor="dynamic: ${dynamic}; wrap-count: ${wrapCount}" cloneable color="white"`
               + ` position="0 ${offset} 0.2" rotation="0 ${-90 * direction} ${90 * direction}" scale="0.2 0.2 0.02">`)
    }
    $self.append(createMonitor(0.2, 0.2, false, 25))
    $self.append(createMonitor(0.2, -0.05, true, 12))
  }

});
