/* global AFRAME clog collider xyzToFixed getResizeVector catching positionRelativeTo */

function distanceBetween(grabber1, grabber2) {
  return grabber1.object3D.getWorldPosition().distanceTo(grabber2.object3D.getWorldPosition())
}

AFRAME.registerComponent('resizer', {
  init: function() {
    let self = this
    let host = self.el
    let parent = self.el.parentNode // use localToWorld() rather than specifically using parent??

    setTimeout(() => {
      catching(() => {        
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

          self.grabbed = grabbed
          self.otherGrabber = otherGrabber

          self.resizeInitialScale = grabbed.object3D.scale.clone()
          self.resizeInitialDistance = distanceBetween(host, otherGrabber)
          clog('resizer', 'got initial state')
          self.grabbed.setAttribute('resizing', '')
          setTimeout(() => {
            self.resizingComponent = self.grabbed.components.resizing
          }, 0)
        })
        grabber.onRelease(() => {
          self.grabbed = null          
        })
      })
    }, 0)
  },
  tick: function() {
    let self = this
    let parent = self.el.parentNode
    catching(() => {
      if (!self.grabbed) {
        return
      }
      clog('resizer', 'resizing - in tick')
      let grabDistance = distanceBetween(self.el, self.otherGrabber)
      let resizeFactor = grabDistance / self.resizeInitialDistance

      // clog(`grabDistance ${grabDistance} initial ${self.resizeInitialDistance}`)

      let posInGrabbedSpace = positionRelativeTo(parent, self.grabbed.object3D)
      // clog(`resizer pos in space of grabbed:\n${posInGrabbedSpace.x.toFixed(2)} ${posInGrabbedSpace.y.toFixed(2)} ${posInGrabbedSpace.z.toFixed(2)}`)
      self.resizingComponent.updateInfo({'resizer pos': xyzToFixed(posInGrabbedSpace)})
      let newScale = self.resizeInitialScale.clone().multiplyVectors(self.resizeInitialScale, getResizeVector(resizeFactor, posInGrabbedSpace))
      self.grabbed.object3D.scale.copy(newScale) 
    })
  }
});
