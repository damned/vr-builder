/* global AFRAME */
var chai = chai || {}
var expect = chai.expect

describe('a-frame and three.js nested entities and transforms', () => {
  let $scene
  before(() => $scene = $('<a-scene embedded>').appendTo('body'))
  beforeEach(() => $scene.empty())
  xdescribe('a boring single entity in default placement', () => {
    let boring
    let boring3d
    beforeEach(() => {
      boring = $('<a-box></a-box>').appendTo($scene).get(0)
      boring3d = boring.object3d
    })
    it('will have local position at origin', () => {
      expect(boring.getAttribute('position')).to.eql({x: 0, y: 0, z: 0})
    })
  })
})
