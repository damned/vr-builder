/* global AFRAME THREE */
var chai = chai || {}
var expect = chai.expect

let vector = (x, y, z) => new THREE.Vector3(x, y, z)

describe('a-frame and three.js nested entities and transforms', () => {
  const identityMatrix = new THREE.Matrix4().identity()
  let $scene = $('<a-scene style="height: 200px" embedded>').appendTo('body')

  beforeEach(() => $scene.empty())
  after(() => {
    $scene.remove()
    $scene = null
  })
  
  let localMatrix
  let worldMatrix

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

    describe('the underlying matrices', () => {
      beforeEach(() => {
        localMatrix = boring.object3D.matrix
        worldMatrix = boring.object3D.matrixWorld
      })
      
      it('will have an identity local matrix: one that transforms a point or matrix to itself', () => {
        expect(localMatrix.equals(identityMatrix)).to.be.true
        expect(vector(1, 2, 3).applyMatrix4(localMatrix)).to.deep.equal(vector(1, 2, 3))
      })
      
      it('will also have an identity world matrix', () => {
        expect(worldMatrix.equals(identityMatrix)).to.be.true
        expect(vector(1, 2, 3).applyMatrix4(worldMatrix)).to.deep.equal(vector(1, 2, 3))
      })      
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
