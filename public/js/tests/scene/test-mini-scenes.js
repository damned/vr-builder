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
    
    let isAframeInternalEntity = entity => entity.hasAttribute('aframe-injected')
    
    let getSceneEntities = () => {
      return Array.from(scene.object3D.children).map(child => {
        if (child.el) {
          if (!isAframeInternalEntity(child.el)) {
            return child.el
          }
        }
        return null
      }).filter(child => child.el)
    }

    let cleanUp = () => {
      if (startHandler) {
        scene.removeEventListener('renderstart', onRenderStartHandler)
        startHandler = null
      }
      getSceneEntities().forEach(entity => {
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
      append: (html) => {
        $scene.append(html)
      },
      cleanUp: cleanUp,
      apply: (handler) => {
        if (scene.renderStarted) {
          console.log('render already started!')
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
  const colors = ['yellow', 'red', 'blue', 'green', 'lightyellow', 'pink', 'lightgreen', 'white']
  
  let scene = createSceneFixture()
  
  for (let i=0; i < 50; i++) {
    it('load up aframe: ' + i, (done) => {
      let color = colors[i % colors.length]
      scene.append(`<a-box color="${color}" position="0 1 -2"></a-box>`)
      scene.apply(() => {
        expect(scene.scene.renderStarted).to.eql(true)
        done()
      })
    })
  }

})
