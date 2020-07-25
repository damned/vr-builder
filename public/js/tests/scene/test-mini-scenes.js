/* global AFRAME */
var chai = chai || {}
var expect = chai.expect

describe('functional testing with aframe', function() {
  this.timeout(10000)

  function createSceneFixture() {
    console.log('loading up aframe')
    let sceneHtml = '<a-scene embedded style="height: 400px; width: 600px;"></a-scene>'
    let $scene = $(sceneHtml)
    $scene.appendTo($('#aframe-container'))

    let scene = $scene.get(0)
    let startHandler = null
    
    let cleanUp = () => {
      scene.pause()
      $scene.remove()
      scene = null
      $scene = null        
    }
    
    let onRenderStartHandler = () => {
      startHandler()
    }
    
    $scene.on('renderstart', onRenderStartHandler)
    
    return {
      $scene: $scene,
      scene: scene,
      cleanUp: cleanUp,
      onStart: (handler) => {
        startHandler = handler
      }
    }
  }
  
  for (let i=0; i < 20; i++) {
    it('load up aframe: ' + i, (done) => {
      let sceneFixture = createSceneFixture()
      sceneFixture.$scene.append('<a-box color="yellow" position="0 1 -2"></a-box>')
      sceneFixture.onStart(() => {
        expect(sceneFixture.scene.renderStarted).to.eql(true)
        setTimeout(() => {
          sceneFixture.cleanUp()
          done()
        }, 100)
      })
    })
  }

})
