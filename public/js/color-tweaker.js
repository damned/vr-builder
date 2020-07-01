/* global AFRAME clog catching */

function findTouchSourceWeAreAttachedTo($host) {
  let $touchSourceAncestor = $host.closest('[touch-source]')
  if ($touchSourceAncestor.length == 0) {
    return undefined
  }
  return $touchSourceAncestor.get(0).components['touch-source']
}

function createTweakerModel($host) {
  let $model = $(`<a-sphere class="color-tweaker-model touchable" scale="0.1 0.1 0.1" radius="0.5"></a-sphere>`).appendTo($host)
  $model.append(`<a-cylinder position="1.2 0 0" rotation="0 0 90" radius="0.5" height="0.3" color="red">`)
  $model.append(`<a-cylinder position="0 1.2 0" rotation="0 0 0" radius="0.5" height="0.3" color="green">`)
  $model.append(`<a-cylinder position="0 0 1.2" rotation="90 0 0" radius="0.5" height="0.3" color="blue">`)
  return $model  
}

AFRAME.registerComponent('color-tweaker', {
  init: function() {
    let self = this
    let host = self.el
    let $host = $(host)
    
    let tickInterval = 10
    
    $host.append(`<a-box class="color-tweaker-bounds" follower-constraint="axis-limit: 0.5" opacity="0.1" color="white"></a-box>`)
    let controlModel = createTweakerModel($host).get(0)
    let tracking
    let touchSource
    let acquireTouchSource = function() {
      touchSource = findTouchSourceWeAreAttachedTo($host)
      if (touchSource) {
        touchSource.onTouchStart((touched) => {
          clog('color-tweaker', 'got a touch:', touched)
          tracking = touched
        })
      }
      else {
        clog('color-tweaker', 'could not find touch-source ancestor')
      }
    }
    let tickCount = 0

    let matchTrackedColor = function() {
      let trackedColor = tracking.getAttribute('material').color
      controlModel.setAttribute('color', trackedColor)
    }
    
    let rgbComponentFromAxis = function(controlAxisValue) {
      return Math.floor(Math.max(Math.min(255 * (controlAxisValue + 0.5), 255), 0)).toString(16).padStart(2, '0')
    }
    
    let updateTrackedColor = function() {
      let pos = controlModel.object3D.position
      let color = '#' + rgbComponentFromAxis(pos.x) + rgbComponentFromAxis(pos.y) + rgbComponentFromAxis(pos.z)
      tracking.setAttribute('color', color)
      clog('color-tweaker', 'tweaker pos, update color:', pos, color)
    }
    
    let controlBeingMoved = () => controlModel.hasAttribute('follower')
    
    self.tick = () => {
      catching(() => {
        if (tickCount % tickInterval == 0) {
          if (touchSource) {
            if (tracking) {
              matchTrackedColor()
              if (controlBeingMoved()) {
                updateTrackedColor()                
              }
            }
          }
          else {
            acquireTouchSource()
          }
        }
        tickCount++        
      })
    }
  }
});

