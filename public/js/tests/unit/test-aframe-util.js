/* global getResizeVector */
var chai = chai || {}
var expect = chai.expect

function xyzOf(vector3) {
  return { 
    x: vector3.x, 
    y: vector3.y,
    z: vector3.z 
  }
}

describe('getResizeVector', () => {

  describe('when resizer not aligned to any axis of thing being resized', () => {
  
    it('will give uniform resizing at resizeFactor scale, for positive vector values', () => {
      let resizerPosition = { 
        x: 3, 
        y: 3,
        z: 3 
      }
      let resizeFactor = 2
      
      expect(xyzOf(getResizeVector(resizeFactor, resizerPosition))).to.eql({ 
        x: 2, 
        y: 2,
        z: 2
      })
    })
    
    it('will give uniform resizing at resizeFactor scale, for negative vector values', () => {
      let resizerPosition = { 
        x: -1, 
        y: -1,
        z: -1 
      }
      let resizeFactor = 2
      
      expect(xyzOf(getResizeVector(resizeFactor, resizerPosition))).to.eql({ 
        x: 2, 
        y: 2,
        z: 2
      })
    })
    
  })

  describe('when resizer close to x axis of thing being resized', () => {
  
    [ { y: 0,    z: 0},
      { y: 0.1,  z: 0},
      { y: -0.1, z: 0},
      { y: 0,    z: 0.1},
      { y: 0,    z: -0.1}].forEach(function(yz) {
      
      it('with y (' + yz.y + ') or z (' + yz.z + ') near x-axis, will scale only in x', () => {
        let resizerPosition = { 
          x: 1.1,
          y: yz.y,
          z: yz.z
        }
        let resizeFactor = 3

        expect(xyzOf(getResizeVector(resizeFactor, resizerPosition))).to.eql({ 
          x: 3, 
          y: 1,
          z: 1
        })
      })
      
    })
  })

  describe('when resizer just a bit further away from x axis of thing being resized', () => {
  
    [ { y: 0.3,   z: 0.1},
      { y: 0.25,  z: 0},
      { y: -0.25, z: 0},
      { y: 0,     z: 0.25},
      { y: 0,     z: -0.25}].forEach(function(yz) {
      
      it('with y (' + yz.y + ') or z (' + yz.z + ') not quite close enough to x-axis, will scale uniformly', () => {
        let resizerPosition = { 
          x: 1.2,
          y: yz.y,
          z: yz.z
        }
        let resizeFactor = 4

        expect(xyzOf(getResizeVector(resizeFactor, resizerPosition))).to.eql({ 
          x: 4, 
          y: 4,
          z: 4
        })
      })
      
    })
  })

  describe('when resizer close to y axis of thing being resized', () => {
  
    [ { x: 0,    z: 0},
      { x: 0.1,  z: 0},
      { x: -0.1, z: 0},
      { x: 0,    z: 0.1},
      { x: 0,    z: -0.1}].forEach(function(xz) {
      
      it('with x (' + xz.x + ') or z (' + xz.z + ') near y-axis, will scale only in y', () => {
        let resizerPosition = { 
          x: xz.x,
          y: -1,
          z: xz.z
        }
        let resizeFactor = 7

        expect(xyzOf(getResizeVector(resizeFactor, resizerPosition))).to.eql({ 
          x: 1, 
          y: 7,
          z: 1
        })
      })
      
    })
  })

  describe('when resizer just a bit further away from y axis of thing being resized', () => {
  
    [ { x: 0.25,  z: 0.25},
      { x: 0.25,  z: 0},
      { x: -0.25, z: 0},
      { x: 0,     z: 0.25},
      { x: 0,     z: -0.25}].forEach(function(xz) {
      
      it('with x (' + xz.x + ') or z (' + xz.z + ') not quite close enough to y-axis, will scale uniformly', () => {
        let resizerPosition = { 
          x: xz.x,
          y: 1,
          z: xz.z
        }
        let resizeFactor = 4

        expect(xyzOf(getResizeVector(resizeFactor, resizerPosition))).to.eql({ 
          x: 4, 
          y: 4,
          z: 4
        })
      })
      
    })
  })

  describe('when resizer close to z axis of thing being resized', () => {
  
    it('with x and y near z-axis, will scale only in z', () => {
      let resizerPosition = { 
        x: -0.05,
        y: 0.15,
        z: 1
      }
      let resizeFactor = 2

      expect(xyzOf(getResizeVector(resizeFactor, resizerPosition))).to.eql({ 
        x: 1, 
        y: 1,
        z: 2
      })
    })
      
  })

  describe('when resizer is further away from what is being resized, the axis lock activates proportionately further from the lock axis', () => {
  
    it('when total distance is larger, axis lock is activated further from axis', () => {
      let resizerPosition = { 
        x: -0.4,
        y: 0.4,
        z: 2
      }
      let resizeFactor = 2

      expect(xyzOf(getResizeVector(resizeFactor, resizerPosition))).to.eql({ 
        x: 1, 
        y: 1,
        z: 2
      })
    })
      
  })

})
