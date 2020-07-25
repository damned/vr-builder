/* global AFRAME THREE identityMatrix reparent matrixCopy boundingBoxOf vector3d */
var chai = chai || {}
var expect = chai.expect

describe('reparenting', () => {
  let $scene = $('<a-scene style="height: 200px" embedded>').appendTo('body')
  let v3 = new THREE.Vector3()
  
  beforeEach(() => {
    $scene.empty()
  })

  after(() => {
    $scene.remove()
    $scene = null
  })
  
  let localMatrix
  let worldMatrix
  
  describe('a nested sphere being reparented under another entity it sits on top of, but keeping original world representation', () => {
    let child
    let childWorldMatrix
    let originalParent
    let targetParent
    
    beforeEach((done) => {
      let parent = $('<a-entity id="original-parent">' +
                      '<a-sphere id="child" position="-1 1 0" scale="0.1 0.1 0.1"></a-sphere>' +
                      '<a-box id="target-parent" position="-1 0 0" scale="2 2 2"></a-box>' +
                     '</a-entity>').appendTo($scene).get(0)

      child = $('#child').get(0)
      originalParent = parent
      targetParent = $('#target-parent').get(0)
      parent.addEventListener('loaded', () => {
        originalParent.object3D.updateMatrixWorld()
        targetParent.object3D.updateMatrixWorld()
        childWorldMatrix = matrixCopy(child.object3D.matrixWorld)
        done()
      })
    })
    afterEach(() => {
      if (child.parentNode) {
        child.parentNode.removeChild(child)        
      }
      child = null
    })
    
    let childWorldPosition = {x:-1, y: 1, z: 0}
    let childWorldMinBounds = {x:-1.1, y: 0.9, z:-0.1}
    let childWorldMaxBounds = {x:-0.9, y: 1.1, z: 0.1}

    describe('original child sphere placement', () => {
      it('has world position matching its local position (as its parent has indentity world matrix)', () => {
        expect(child.object3D.getWorldPosition(v3)).to.shallowDeepEqual(childWorldPosition)
      })      
      it('has world bounding box at top of target parent box', () => {
        expect(boundingBoxOf(child.object3D).min).to.shallowDeepEqual(childWorldMinBounds)
        expect(boundingBoxOf(child.object3D).max).to.shallowDeepEqual(childWorldMaxBounds)
      })      
    })

    describe('pre-conceptions about matrices, before any reparenting', () => {
      it("the child's parent's starting local matrix and world matrix should be identity as they are untransformed", () => {
        expect(originalParent.object3D.matrix).to.shallowDeepEqual(identityMatrix)
        expect(originalParent.object3D.matrixWorld).to.shallowDeepEqual(identityMatrix)
      })      
      it("the child's world matrix should be equal to the multiplication of its parent world matrix by its local matrix, i.e. its local matrix", () => {
        expect(child.object3D.matrixWorld).to.shallowDeepEqual(child.object3D.matrix)
      })      
    })

    describe('reparenting, bearing in mind the entity needs to be cloned before appending as it will be invisible due to aframe bug', () => {
      let reparented
      let reparented3d
      
      beforeEach((done) => {
        reparented = reparent(child, targetParent, done)
        reparented3d = reparented.object3D
      })
      
      describe('reparented child sphere', () => {
        it('should retain its world matrix', (done) => {
          expect(reparented3d.matrixWorld).to.shallowDeepEqual(childWorldMatrix)
          done()
        })      
        it('should retain its world position', () => {
          expect(reparented3d.getWorldPosition(v3)).to.shallowDeepEqual(childWorldPosition)
        })      
        it('should retain original sphere world presence', () => {
          expect(boundingBoxOf(reparented3d).min).to.shallowDeepEqual(childWorldMinBounds)
          expect(boundingBoxOf(reparented3d).max).to.shallowDeepEqual(childWorldMaxBounds)
        })
        it('should be parented correctly in three.js', (done) => {
          expect(reparented.object3D.parent).to.equal(targetParent.object3D)
          done()
        })      
      })      
    })

  })

})
