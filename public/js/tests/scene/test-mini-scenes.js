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
    
    let keepEntities = ['camera', 'a-light']
    let getSceneEntities = (entitiesToOmit) => {
      let entities = []
      Array.from(scene.object3D.children).forEach(child => {
        if (child.el) {
          if (!entitiesToOmit.includes(child.el)) {
            entities.push(child.el)          
          }
          else {
            console.log('omitting', child.el, child.el.tagName)
          }
        }
      })
      return entities
    }

    let cleanUp = () => {
      if (startHandler) {
        scene.removeEventListener('renderstart', onRenderStartHandler)
        startHandler = null
      }
      getSceneEntities(initialEntities).forEach(entity => {
        console.log('removing', entity, entity.tagName)
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
      }
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
        setTimeout(() => {
          sceneFixture.cleanUp()
          done()
        }, 500)
      })
    })
  }

})
