/* global AFRAME THREE */
var chai = chai || {}
var expect = chai.expect

let vector = (x, y, z) => new THREE.Vector3(x, y, z)
let bounds = (object3d) => new THREE.Box3().setFromObject(object3d)

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
    
    it('will have a bounding box of unit dimensions centred on origin', () => {
      expect(bounds(boring.object3D).min).to.shallowDeepEqual({x:-0.5, y:-0.5, z:-0.5})
      expect(bounds(boring.object3D).max).to.shallowDeepEqual({x: 0.5, y: 0.5, z: 0.5})
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

  describe('a single entity translated somewhere', () => {
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
    
    describe('the underlying matrices', () => {
      beforeEach(() => {
        let object3d = translated.object3D
        object3d.updateMatrix()
        object3d.updateMatrixWorld()
        localMatrix = object3d.matrix
        worldMatrix = object3d.matrixWorld
      })
      
      it('will have a local matrix that translates a point by its own translation', () => {
        expect(vector(2, 4, 6).applyMatrix4(localMatrix)).to.shallowDeepEqual(vector(3, 6, 9))
      })
      
      it('will have a world matrix equal to the local matrix', () => {
        expect(worldMatrix).to.shallowDeepEqual(localMatrix)
        expect(vector(0, 1, 0).applyMatrix4(worldMatrix)).to.shallowDeepEqual(vector(1, 3, 3))
      })      
    })

  })

  describe('a single entity scaled uniformly at origin', () => {
    let scaled
    
    beforeEach((done) => {
      scaled = $('<a-box scale="2 2 2"></a-box>').appendTo($scene).get(0)
      scaled.addEventListener('loaded', () => done())
    })
    
    it('will be at origin', () => {
      expect(scaled.getAttribute('position'))
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
      expect(scaled.object3D.position)
        .to.shallowDeepEqual({x: 0, y: 0, z: 0})
    })
    
    it('will have a bounding box of unit dimensions centred on origin', () => {
      expect(bounds(scaled.object3D).min).to.shallowDeepEqual({x:-1, y:-1, z:-1})
      expect(bounds(scaled.object3D).max).to.shallowDeepEqual({x: 1, y: 1, z: 1})
    })

    describe('the underlying matrices', () => {
      beforeEach(() => {
        let object3d = scaled.object3D
        object3d.updateMatrix()
        object3d.updateMatrixWorld()
        localMatrix = object3d.matrix
        worldMatrix = object3d.matrixWorld
      })
      
      it('will have a local matrix that transforms a point away from the origin by its scaling factor', () => {
        expect(vector(2, 4, 6).applyMatrix4(localMatrix)).to.shallowDeepEqual(vector(4, 8, 12))
      })
      
      it('will have a world matrix equal to the local matrix', () => {
        expect(worldMatrix).to.shallowDeepEqual(localMatrix)
        expect(vector(0, 1, 0).applyMatrix4(worldMatrix)).to.shallowDeepEqual(vector(0, 2, 0))
      })      
    })

  })

  describe('a single entity scaled and translated', () => {
    let transformed
    
    beforeEach((done) => {
      transformed = $('<a-box position="-1 -2 1" scale="2 2 2"></a-box>').appendTo($scene).get(0)
      transformed.addEventListener('loaded', () => done())
    })
    
    it('will be positioned at its unscaled position coordinates', () => {
      expect(transformed.getAttribute('position')).to.shallowDeepEqual({x: -1, y: -2, z: 1})
      expect(transformed.object3D.position)       .to.shallowDeepEqual({x: -1, y: -2, z: 1})
    })
        

    it('will have a bounding box of scaled dimensions around the translated origin', () => {
      expect(bounds(transformed.object3D).min).to.shallowDeepEqual({x:-2, y:-3, z: 0})
      expect(bounds(transformed.object3D).max).to.shallowDeepEqual({x: 0, y:-1, z: 2})
    })

    describe('the underlying matrices', () => {
      beforeEach(() => {
        let object3d = transformed.object3D
        object3d.updateMatrix()
        object3d.updateMatrixWorld()
        localMatrix = object3d.matrix
        worldMatrix = object3d.matrixWorld
      })
      
      it('will have a local matrix that transforms a point by its scale then moves it by the translation', () => {
        expect(vector(2, 4, 6).applyMatrix4(localMatrix)).to.shallowDeepEqual(vector(3, 6, 13))
      })
      
      it('will have a world matrix equal to the local matrix', () => {
        expect(worldMatrix).to.shallowDeepEqual(localMatrix)
        expect(vector(0, 1, 0).applyMatrix4(worldMatrix)).to.shallowDeepEqual(vector(-1, 0, 1))
      })      
    })

  })
})
