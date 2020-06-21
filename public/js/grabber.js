/* global AFRAME THREE colorFromEntityRotation collider getResizeVector clog catching xyzToFixed addDebugColor removeDebugColor */
let debug = { useColor: true }
var options = { colorTwist: false }

function debugColor(el, color) {
  if (debug.useColor) {
    addDebugColor(el, color)
  }
}

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

// debugColor
AFRAME.registerComponent('grabber', {
  schema: {type: 'string'},
  init: function() {
    let self = this                 
    let $host = $(this.el)
    let host = this.el
    host.setAttribute('toucher', '')
    setTimeout(() => {
      self.grabberCollider = collider(host)
      self.toucher = host.components.toucher
    }, 0)
    self.ticks = 0
    self.grabbed = null
    self.secondGrabHandlers = []
    self.onSecondGrab = (handler) => { self.secondGrabHandlers.push(handler) }
  },
  update: function(oldData) {
    console.log('this.data', this.data)
    this.grabbedLeaderSpec = this.data
  },
  tick: function (time, timeDelta) {
    let self = this
    catching(function (){
      let parent = self.el.parentNode // use localToWorld() rather than specifically using parent??
      self.ticks++
      if (options.colorTwist) {
        self.el.setAttribute('color', colorFromEntityRotation(parent))
      }
      if (self.grabbed && self.currentlyResizing) {
        let otherGrabber = self.grabbed.currentGrabber
        self.secondGrabHandlers.forEach((handler) => { handler(self.grabbed, otherGrabber) })
        
        let grabDistance = distanceBetween(self.el, otherGrabber)
        let resizeFactor = grabDistance / self.resizeInitialDistance

        // clog(`grabDistance ${grabDistance} initial ${self.resizeInitialDistance}`)

        let posInGrabbedSpace = positionRelativeTo(parent, self.grabbed)
        // clog(`resizer pos in space of grabbed:\n${posInGrabbedSpace.x.toFixed(2)} ${posInGrabbedSpace.y.toFixed(2)} ${posInGrabbedSpace.z.toFixed(2)}`)
        self.resizingComponent.updateInfo({'resizer pos': xyzToFixed(posInGrabbedSpace)})
        let newScale = self.resizeInitialScale.clone().multiplyVectors(self.resizeInitialScale, getResizeVector(resizeFactor, posInGrabbedSpace))
        self.grabbed.object3D.scale.copy(newScale) 
        return
      }
    })
  },
  grasp: function(event) {
    catching(function (){
      let host = this.el
      let self = this
      debugColor(host, 'black')
      host.setAttribute('debugged', 'oh come on')
      clog('starting grasp')
      clog('grasp', 'grasping...')
      if (self.toucher.isTouching()) {
        clog('grasp', 'touching something, getting closestIntersectedEl...')
        let tograb = self.toucher.closest()
        clog('grasp', tograb.outerHTML)
        if (tograb.currentlyGrabbed) {
          let otherGrabber = tograb.currentGrabber
          this.resizeInitialScale = tograb.object3D.scale.clone()
          this.resizeInitialDistance = distanceBetween(host, otherGrabber)
          this.currentlyResizing = true
          this.grabbed = tograb
          this.grabbed.setAttribute('resizing', '')
          setTimeout(() => {
            self.resizingComponent = self.grabbed.components.resizing
          }, 0)
          return
        }
        debugColor(host, 'white')
        debugColor(tograb, 'white')
        host.setAttribute('debugged', `grabbing: ${tograb.tagName} with ${this.grabbedLeaderSpec}`)
        console.log('grabberId', this.grabbedLeaderSpec)
        let cloneable = tograb.components['cloneable']
        if (cloneable) {
          clog('grasp', 'its cloneable')
          let sourceMonitor = tograb.components['monitor']
          let monitored
          if (sourceMonitor) {
            clog('grasp', 'there is a source monitor')
            monitored = sourceMonitor.getMonitored()
            clog('grasp', 'got monitored', monitored)
          }
          else {
            clog('grasp', 'there is no source monitor')            
          }
          tograb = cloneable.clone()
          // how _should_ this pass off to the monitor - maybe provide cloneInto method on component
          // where it will clone its state into the (new/empty) monitor component (or cloneOnto onto
          // an entity)
          if (monitored) {
            setTimeout(() => {
              clog('grasp', 'monitored ok, getting cloned monitor component...')
              let clonedComponents = tograb.components 
              clog('grasp', 'components of cloned', clonedComponents)
              let monitorClone = clonedComponents['monitor']
              if (monitorClone) {
                clog('grasp', 'got monitor clone, calling...')
                monitorClone.monitor(monitored)
              }            
            }, 0)
          }
        }
        tograb.setAttribute('follower', 'leader: ' + this.grabbedLeaderSpec)
        this.grabbed = tograb
        this.grabbed.currentlyGrabbed = true
        this.grabbed.currentGrabber = host
        debugColor(this.grabbed, 'blue')
        host.setAttribute('opacity', 0.5)
      }          
    }.bind(this))
  },
  release: function(event) {
    if (this.grabbed != null) {
      if (this.currentlyResizing) {
        this.currentlyResizing = false    
      }
      else {
        this.grabbed.currentlyGrabbed = false
        this.grabbed.removeAttribute('follower')        
      }
    }
    removeDebugColor(this.grabbed)
    this.grabbed = null
    this.el.setAttribute('opacity', 1)
  }
});
