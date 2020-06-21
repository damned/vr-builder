/* global AFRAME clog collider */

AFRAME.registerComponent('resizer', {
  init: function() {
    let self = this
    let host = self.el
    let 
    setTimeout(() => {
      let grabber = host.components.grabber
      if (!grabber) {
        clog('oops - resizer needs a grabber on this element!!')
        return
      }
      grabber.onSecondGrab((grabbed, otherGrabber) => {
        clog('resizer', 'in resizer i got a second grab event for: ' + grabbed.tagName)
        
        let grabDistance = distanceBetween(self.el, otherGrabber)
        let resizeFactor = grabDistance / self.resizeInitialDistance

        // clog(`grabDistance ${grabDistance} initial ${self.resizeInitialDistance}`)

        let posInGrabbedSpace = positionRelativeTo(parent, self.grabbed)
        // clog(`resizer pos in space of grabbed:\n${posInGrabbedSpace.x.toFixed(2)} ${posInGrabbedSpace.y.toFixed(2)} ${posInGrabbedSpace.z.toFixed(2)}`)
        self.resizingComponent.updateInfo({'resizer pos': xyzToFixed(posInGrabbedSpace)})
        let newScale = self.resizeInitialScale.clone().multiplyVectors(self.resizeInitialScale, getResizeVector(resizeFactor, posInGrabbedSpace))
        self.grabbed.object3D.scale.copy(newScale) 

      })      
    }, 0)
  }
});
