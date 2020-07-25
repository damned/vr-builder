/* global AFRAME createSceneFixture */
var chai = chai || {}
var expect = chai.expect

describe('functional testing with aframe', function() {
  const colors = ['yellow', 'red', 'blue', 'green', 'lightyellow', 'pink', 'lightgreen', 'white']
  
  let scene = createSceneFixture({stats: false})
  
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
