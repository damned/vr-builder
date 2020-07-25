let testable = (entity, componentName) => {
  let position = () => entity.object3D.position
  let api = {
    moveTo: pos => {
      position().copy(pos)
    },
    get position() {
      return position()
    }
  }
  if (componentName) {
    api[componentName] = () => entity.components[componentName]
  }
  return api
}


function createSceneFixture(options) {
  console.log('loading up aframe')
  options = options || { stats: true }
  let statsSpec = options.stats ? 'stats' : ''
  let sceneHtml = `<a-scene ${statsSpec} embedded style="height: 400px; width: 600px;"></a-scene>`
  let $scene = $(sceneHtml)
  $scene.appendTo($('#aframe-container'))

  let scene = $scene.get(0)
  let startHandler = null

  let isAframeInternalEntity = entity => entity.hasAttribute('aframe-injected')

  let getSceneEntities = () => {
    return Array.from(scene.object3D.children)
      .filter(child => (child.el && !isAframeInternalEntity(child.el)))
      .map(child => child.el)
  }

  let cleanUp = () => {
    if (startHandler) {
      scene.removeEventListener('renderstart', onRenderStartHandler)
      startHandler = null
    }
    getSceneEntities().forEach(entity => {
      // console.log('removing', entity, entity.tagName)
      scene.removeChild(entity)
    })
  }

  let onRenderStartHandler = () => {
    if (startHandler) {
      startHandler()
    }
  }
  let actionDelayMs = 20
  let applyAction = (handler) => {
    if (scene.renderStarted) {
      // console.log('render already started!')
      setTimeout(() => { // maybe really should be waiting for next render cycle (or complete this and another?)
        handler()
      }, actionDelayMs)
    }
    else {
      startHandler = handler
      scene.addEventListener('renderstart', onRenderStartHandler)
    }
  }
  let applyActions = function(handler) {
    let handlers = Array.from(arguments)
    applyAction(() => {
      handlers[0]()
      if (handlers.length > 1) {
        applyActions.apply(this, handlers.slice(1))
      }
    })
  }
  return {
    $scene: $scene,
    scene: scene,
    append: (html) => {
      $scene.append(html)
    },
    cleanUp: cleanUp,
    actions: applyActions,
    setActionDelay: delayMs => actionDelayMs = delayMs
  }
}
