/* global AFRAME clog collider xyzToFixed getResizeVector */

function distanceBetween(grabber1, grabber2) {
  return grabber1.object3D.getWorldPosition().distanceTo(grabber2.object3D.getWorldPosition())
}

function positionRelativeTo(entity, referenceEntity) {
  let relativePositionInLocalScale = referenceEntity.object3D.worldToLocal(entity.object3D.getWorldPosition())
  let scale = referenceEntity.object3D.scale
  let inNormalisedScale = {
    x: relativePositionInLocalScale.x * scale.x,
    y: relativePositionInLocalScale.y * scale.y,
    z: relativePositionInLocalScale.z * scale.z
  }
  return inNormalisedScale
}

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
        
        self.grabbed = grabbed
        self.otherGrabber = grabbed.currentGrabber
        
        self.resizeInitialScale = grabbed.object3D.scale.clone()
        self.resizeInitialDistance = distanceBetween(host, otherGrabber)
        self.currentlyResizing = true
        self.grabbed.setAttribute('resizing', '')
        setTimeout(() => {
          self.resizingComponent = self.grabbed.components.resizing
        }, 0)
      })
    }, 0)
  },
  tick: function() {
    if (!self.currentlyResizing) {
      return
    }
    let grabDistance = distanceBetween(self.el, self.otherGrabber)
    let resizeFactor = grabDistance / self.resizeInitialDistance

    // clog(`grabDistance ${grabDistance} initial ${self.resizeInitialDistance}`)

    let posInGrabbedSpace = positionRelativeTo(parent, self.grabbed)
    // clog(`resizer pos in space of grabbed:\n${posInGrabbedSpace.x.toFixed(2)} ${posInGrabbedSpace.y.toFixed(2)} ${posInGrabbedSpace.z.toFixed(2)}`)
    self.resizingComponent.updateInfo({'resizer pos': xyzToFixed(posInGrabbedSpace)})
    let newScale = self.resizeInitialScale.clone().multiplyVectors(self.resizeInitialScale, getResizeVector(resizeFactor, posInGrabbedSpace))
    self.grabbed.object3D.scale.copy(newScale) 

  }
});
