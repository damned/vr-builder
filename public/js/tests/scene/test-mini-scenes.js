/* global AFRAME */
var chai = chai || {}
var expect = chai.expect

describe('functional testing with aframe', function() {
  this.timeout(10000)

  function createSceneFixture() {
    console.log('loading up aframe')
    let sceneHtml = '<a-scene stats embedded style="height: 400px; width: 600px;"></a-scene>'
    let $scene = $(sceneHtml)
    $scene.appendTo($('#aframe-container'))

    let scene = $scene.get(0)
    let startHandler = null

    let cleanUp = () => {
      if (startHandler) {
        scene.removeEventListener('renderstart', onRenderStartHandler)
        startHandler = null
      }
      scene.innerHtml = ''
    }
    
    let stats
    
    function loadedHandler() {
      stats = scene.components.stats      
      scene.removeEventListener('loaded', loadedHandler)
    }
    scene.addEventListener('loaded', loadedHandler)

    
    let onRenderStartHandler = () => {
      if (startHandler) {
        startHandler()
      }
    }    
    return {
      $scene: $scene,
      scene: scene,
      cleanUp: cleanUp,
      whenReady: (handler) => {
        if (scene.renderStarted) {
          console.log('render already started!')
          handler()
        }
        else {
          startHandler = handler
          scene.addEventListener('renderstart', onRenderStartHandler)
        }
      },
      get entityCount() { return stats.value }
    }
  }
  const colors = ['yellow', 'red', 'blue', 'green', 'lightyellow', 'pink', 'lightgreen', 'white']
  
  let sceneFixture = createSceneFixture()
  
  for (let i=0; i < 20; i++) {
    it('load up aframe: ' + i, (done) => {
      let color = colors[i % colors.length]
      sceneFixture.scene.play()
      sceneFixture.$scene.append(`<a-box color="${color}" position="0 1 -2"></a-box>`)
      sceneFixture.whenReady(() => {
        expect(sceneFixture.scene.renderStarted).to.eql(true)
        expect(sceneFixture.entityCount).to.eql(1)
        setTimeout(() => {
          sceneFixture.cleanUp()
          done()
        }, 500)
      })
    })
  }

})
