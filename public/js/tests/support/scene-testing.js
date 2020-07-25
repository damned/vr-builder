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
  return {
    $scene: $scene,
    scene: scene,
    append: (html) => {
      $scene.append(html)
    },
    cleanUp: cleanUp,
    apply: (handler) => {
      if (scene.renderStarted) {
        // console.log('render already started!')
        setTimeout(() => {
          handler()
          cleanUp()
        }, 0)
      }
      else {
        startHandler = handler
        scene.addEventListener('renderstart', onRenderStartHandler)
      }
    }
  }
}
