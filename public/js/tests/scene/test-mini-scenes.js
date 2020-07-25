/* global AFRAME */
var chai = chai || {}
var expect = chai.expect

describe('functional testing with aframe', () => {
  
  for (let i=0; i < 20; i++) {
    it('load up aframe: ' + i, (done) => {
      console.log('loading up aframe')
      let scene = '<a-scene embedded style="height: 400px; width: 600px;">' 
        +   '<a-box color="gray" position="0 1 -2"></a-box>'
        + '</a-scene>'
      let $scene = $(scene)
      $scene.appendTo($('#aframe-container'))
      $scene.on('renderstart', () => {
        expect($scene.get(0).renderStarted).to.eql(true)
        done()
      })
    })
  }

})
