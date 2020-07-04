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
    
    it('will have local a-frame position at origin', () => {
      expect(boring.getAttribute('position'))
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
    })

    it('will have local three.js position at origin', () => {
      expect(boring.object3D.position)
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
    })

    it('will have an identity local matrix: one that transforms a point to itself or ', () => {
      expect(boring.object3D.position)
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
    })
})

  describe('a single entity translatedsomewhere', () => {
    let translated
    
    beforeEach((done) => {
      translated = $('<a-box position="1 2 3"></a-box>').appendTo($scene).get(0)
      translated.addEventListener('loaded', () => done())
    })
    
    it('will have offset local a-frame position', () => {
      expect(translated.getAttribute('position'))
        .to.shallowDeepEqual({x: 1, y: 2, z: 3})
    })
    it('will have offset local three.js position', () => {
      expect(translated.object3D.position)
        .to.shallowDeepEqual({x: 1, y: 2, z: 3})
    })
  })
})
