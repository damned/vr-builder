/* global AFRAME */
var chai = chai || {}
var expect = chai.expect

describe('functional testing with aframe', () => {
  
  it('load up aframe', (done) => {
    let scene = '<a-scene embedded>' 
      +   '<a-box color="yellow" position="0 0 -1"></a-box>'
      + '</a-scene>'
    let $scene = $(scene)
    $scene.appendTo($('#aframe-container'))
    $scene.on('loaded', () => {
    })
    setTimeout(() => {
      expect($scene.get(0).renderStarted).to.eql(true)
      done()    
    }, 5000)
  })
})
