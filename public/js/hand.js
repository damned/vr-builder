/* global AFRAME clog afterCreation */

function addProps(el, props) {
  for (let name in props) {
    el.setAttribute(name, props[name])  
  }  
}

function createEntity(tag, className, scalex, scaley, scalez) {
  let entity = document.createElement(tag)
  entity.className = className
  entity.object3D.scale.set(scalex, scaley, scalez)    
  return entity  
}

function placeInDefaultPosition(hand, side) {
  let xOffset = side == 'right' ? '0.5' : '-0.5'
  hand.setAttribute('position', xOffset + ' 1.5 -0.5')
}

var Hand = function($hand, options) {
  options = Object.assign({stock: true}, options)
  
  let side = $hand.attr('hand-side')
  let hand = $hand.get(0)
  let handId = $hand.attr('id')
  
  let modelSize = 0.03
  function createHandModel(side) {
    let model = createEntity('a-box', 'hand-model', modelSize, modelSize, modelSize)
    addProps(model, {
      color: 'yellow',
      'hand-side': side,
      grabber: '#' + handId,
      flicker: '',
      resizer: '',
      'blind-release': '',
      debugged: ''
    })
    return model
  }
  function createSleeve(side) {
    let sleeve = createEntity('a-cylinder', 'sleeve', 0.5, 0.5, 0.5)    
    addProps(sleeve, {
      height: '0.3',
      radius: '0.04',
      position: '0 0 0.2',
      rotation: '90 0 0',
      'monitor-home': side,
      'tweaker-home': side
    })
    if (options.stock) {
      addProps(sleeve, {
        'stock-home': side
      })      
    }
    return sleeve
  }
  
  let sleeve = createSleeve(side)
  let $sleeve = $(sleeve)
  $sleeve.appendTo($hand)
  $hand.on('handtoolstart', () => {
    // clog('handtoolstart', 'got in hand - hiding sleeve')
    $sleeve.remove()
    model.setAttribute('visible', 'false')
  })

  let model = createHandModel(side)
  let $model = $(model)
  $model.appendTo($hand)
  afterCreation(() => model.components.flicker.onFlick(() => {
    model.setAttribute('color', 'orange')
    model.components.grabber.cloneGrabbed()
    setTimeout(() => model.setAttribute('color', 'yellow'), 1000)
  }))
  model.addEventListener('blind-release', event => {
    let released = event.detail.released
    clog('blind-release', 'released', released)
    released.parentNode.removeChild(released)
    released.setAttribute('touch-event-suppression', '')
    clog('blind-release', 'removed from parent')
  })
  
  let grabber = model.components.grabber
  
  function debug(message) {
    model.setAttribute('debugged', message)
  }

  var grabHandler = function(event) {
    grabber.grasp()
    model.emit('grasp')
  }
  var triggerReleaseHandler = function(event) {
    grabber.release()
    model.emit('ungrasp')
  }

  //debug('i am tne hand')
  
  $hand.attr('oculus-touch-controls', 'hand: ' + side + '; model: false')
  $hand.addClass('hand')
  
  hand.setAttribute('remote-toucher', '')
  
  $hand.on('triggerdown', grabHandler)
       .on('triggerup', triggerReleaseHandler)
  
  
  placeInDefaultPosition(hand, side)
  
  clog('wazoo')
}