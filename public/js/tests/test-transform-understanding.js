/* global AFRAME */
var chai = chai || {}
var expect = chai.expect

describe('a-frame and three.js nested entities and transforms', () => {
  let $scene = $('<a-scene style="height: 200px" embedded>').appendTo('body')

  beforeEach(() => $scene.empty())
  after(() => {
    $scene.remove()
    $scene = null
  })
  
  describe('a boring single entity in default placement', () => {
    let boring
    
    beforeEach((done) => {
      boring = $('<a-box></a-box>').appendTo($scene).get(0)
      boring.addEventListener('loaded', () => done())
    })
    
    it('will have local position at origin', () => {
      expect(boring.getAttribute('position'))
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
      
      expect(boring.object3D.position)
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
    })
  })

  describe('a single entity positioned somw', () => {
    let boring
    
    beforeEach((done) => {
      boring = $('<a-box></a-box>').appendTo($scene).get(0)
      boring.addEventListener('loaded', () => done())
    })
    
    it('will have local position at origin', () => {
      expect(boring.getAttribute('position'))
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
      
      expect(boring.object3D.position)
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
    })
  })
})
