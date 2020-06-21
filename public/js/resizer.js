/* global AFRAME clog collider */

AFRAME.registerComponent('resizer', {
  init: function() {
    let self = this
    let host = self.el
    setTimeout(() => {
      let grabber = host.components.grabber
      if (!grabber) {
        clog('oops - resizer needs a grabber on this element!!')
        return
      }
      grabber.onSecondGrab((grabbed) => {
        clog('resizer', 'in resizer i got a second grab event for: ' + grabbed.tagName)
      })      
    }, 0)
  }
});
