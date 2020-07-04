/* global AFRAME */
var chai = chai || {}
var expect = chai.expect

describe('a-frame and three.js nested entities and transforms', () => {
  let $scene = $('<a-scene>').appendTo('body')
  
  beforeEach(() => $scene.empty())
  
  describe('a boring single entity in default placement', () => {
    let boring
    beforeEach(() => {
      boring = $('<a-box></a-box>').appendTo($scene).get(0)
      })
    it('will add a property if it does not exist', () => {
      let original = '<a-box></a-box>'
      expect(patchHtml(original, { 
        rotation: 'fubar'
      })).to.eql('<a-box rotation="fubar"></a-box>')
    })
  })
})
