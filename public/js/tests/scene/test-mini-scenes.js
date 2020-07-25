/* global AFRAME */
var chai = chai || {}
var expect = chai.expect

describe('functional testing with aframe', () => {
  
  function createSceneFixture(done) {
    console.log('loading up aframe')
    let sceneHtml = '<a-scene embedded style="height: 400px; width: 600px;">' 
      +   '<a-box color="gray" position="0 1 -2"></a-box>'
      + '</a-scene>'
    let $scene = $(sceneHtml)
    $scene.appendTo($('#aframe-container'))

    let scene = $scene.get(0)
    
    let startupHandler() => {
      expect(scene.renderStarted).to.eql(true)
      scene.pause()
      $scene.remove()
      scene = null
      $scene = null
      done()
    }
    let startHandlers = []
    $scene.on('renderstart', )
    return {
      $scene: $scene,
      scene: scene,
      cleanUp: () => {
        
      },
      onStart: (handler) => {
        startHandlers.
      }
    }
  }
  
  for (let i=0; i < 20; i++) {
    it('load up aframe: ' + i, (done) => {
      console.log('loading up aframe')
      let sceneHtml = '<a-scene embedded style="height: 400px; width: 600px;">' 
        +   '<a-box color="gray" position="0 1 -2"></a-box>'
        + '</a-scene>'
      let $scene = $(sceneHtml)
      $scene.appendTo($('#aframe-container'))
      let scene = $scene.get(0)
      $scene.on('renderstart', () => {
        expect(scene.renderStarted).to.eql(true)
        scene.pause()
        $scene.remove()
        scene = null
        $scene = null
        done()
      })
    })
  }

})
