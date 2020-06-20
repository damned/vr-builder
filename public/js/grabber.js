/* global AFRAME THREE colorFromEntityRotation collider getResizeVector clog catching */
let debug = { useColor: true }
var options = { colorTwist: false }

function debugColor(el, color) {
  if (debug.useColor) {
    if (!el.hasAttribute('data-original-color')) {
      let originalColor = el.getAttribute('color')
      if (originalColor) {
        el.setAttribute('data-original-color', originalColor)
      }
    }
    el.setAttribute('color', color)    
  }
}

function removeDebugColor(el) {
  if (el.hasAttribute('data-original-color')) {
    el.setAttribute('color', el.getAttribute('data-original-color'))
  }
}

function distanceBetween(grabber1, grabber2) {
  return grabber1.object3D.getWorldPosition().distanceTo(grabber2.object3D.getWorldPosition())
}

function positionRelativeTo(entity, referenceEntity) {
  let relativePositionInLocalScale = referenceEntity.object3D.worldToLocal(entity.object3D.getWorldPosition())
  return {
    // scale? errors on x on undefined
    // x: relativePositionInLocalScale.x / referenceEntity.scale.x,
    // y: relativePositionInLocalScale.y / referenceEntity.scale.y,
    // z: relativePositionInLocalScale.z / referenceEntity.scale.z
    x: relativePositionInLocalScale.x,
    y: relativePositionInLocalScale.y,
    z: relativePositionInLocalScale.z
  };
}

// debugColor
AFRAME.registerComponent('grabber', {
  schema: {type: 'string'},
  init: function() {
    // needs splitting out into a toucher component passing on events to grabber etc.
    this.el.setAttribute('aabb-collider', 'objects: .touchable; collideNonVisible: true' 
                         // + '; debug: true'
                        )
    var $host = $(this.el)
    var host = this.el
    $host.on('hitstart', function() {
      // todo this is a bit chonky finding this through parent!
      let $monitor = $host.parent().find('[monitor]')
      if ($monitor.length > 0)
      $monitor.get(0).components['monitor'].monitor(host.components['aabb-collider'].closestIntersectedEl)
    })
    // end: needs move out through toucher
    
    this.ticks = 0
    this.grabbed = null
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
        let grabDistance = distanceBetween(self.el, otherGrabber)
        let resizeFactor = grabDistance / self.resizeInitialDistance

        // clog(`grabDistance ${grabDistance} initial ${self.resizeInitialDistance}`)

        let posInGrabbedSpace = positionRelativeTo(parent, self.grabbed)
        // clog(`resizer pos in space of grabbed:\n${posInGrabbedSpace.x.toFixed(2)} ${posInGrabbedSpace.y.toFixed(2)} ${posInGrabbedSpace.z.toFixed(2)}`)

        let newScale = self.resizeInitialScale.clone().multiplyVectors(self.resizeInitialScale, getResizeVector(resizeFactor, posInGrabbedSpace))
        self.grabbed.object3D.scale.copy(newScale) 
        return
      }
    })
  },
  grasp: function(event) {
    catching(function (){
      let host = this.el
      debugColor(host, 'black')
      host.setAttribute('debugged', 'oh come on')
      clog('starting grasp')
      clog('grasp', 'grasping...')
      var grabberCollider = collider(host)
      if (grabberCollider.intersectedEls.length > 0) {
        clog('grasp', 'there are some intersected els, using closestIntersectedEl...')
        let tograb = grabberCollider.closestIntersectedEl
        clog('grasp', tograb.outerHTML)
        if (tograb.currentlyGrabbed) {
          let otherGrabber = tograb.currentGrabber
          this.resizeInitialScale = tograb.object3D.scale.clone()
          this.resizeInitialDistance = distanceBetween(host, otherGrabber)
          this.currentlyResizing = true
          this.grabbed = tograb
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
        tograb.setAttribute('follows', this.grabbedLeaderSpec)
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
        this.grabbed.removeAttribute('follows')        
      }
    }
    removeDebugColor(this.grabbed)
    this.grabbed = null
    this.el.setAttribute('opacity', 1)
  }
});
