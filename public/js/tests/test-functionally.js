/* global AFRAME */
var chai = chai || {}
var expect = chai.expect

describe('functional testing with aframe', () => {
  it('load up aframe', () => {
    let scene = '<a-scene>' 
      +   '<a-box position="4 0 1"></a-box>'
      + '</a-scene>'
    expect(patchHtml(original, { position: 'bob' })).to.eql('<a-box position="bob"></a-box>')
  })
})
