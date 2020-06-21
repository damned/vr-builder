/* global AFRAME clog collider xyzToFixed */

AFRAME.registerComponent('resizer', {
  init: function() {
    let self = this
    let host = self.el
    let parent = self.el.parentNode // use localToWorld() rather than specifically using parent??

    setTimeout(() => {
      let grabber = host.components.grabber
      if (!grabber) {
        let err = 'oops - resizer needs a grabber on this element!!'
        clog(err)
        this.el.setAttribute('opacity', 0.5)
        $(this.el).append(`<a-text color="black" value="${err}"`)
        return
      }
      grabber.onSecondGrab((grabbed, otherGrabber) => {
        clog('resizer', 'in resizer i got a second grab event for: ' + grabbed.tagName)
        
        self.resizeInitialScale
        
        let grabDistance = distanceBetween(self.el, otherGrabber)
        let resizeFactor = grabDistance / self.resizeInitialDistance

        // clog(`grabDistance ${grabDistance} initial ${self.resizeInitialDistance}`)

        let posInGrabbedSpace = positionRelativeTo(parent, grabbed)
        // clog(`resizer pos in space of grabbed:\n${posInGrabbedSpace.x.toFixed(2)} ${posInGrabbedSpace.y.toFixed(2)} ${posInGrabbedSpace.z.toFixed(2)}`)
        self.resizingComponent.updateInfo({'resizer pos': xyzToFixed(posInGrabbedSpace)})
        let newScale = self.resizeInitialScale.clone().multiplyVectors(self.resizeInitialScale, getResizeVector(resizeFactor, posInGrabbedSpace))
        grabbed.object3D.scale.copy(newScale) 
      })
    }, 0)
  }
});
