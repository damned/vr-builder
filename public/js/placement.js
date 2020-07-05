/* global THREE */

function copyPlacement(entity) {
  let place = {}
  place.position = new THREE.Vector3()
  place.scale = new THREE.Vector3()
  place.quaternion = new THREE.Quaternion()
  let object3d = entity.object3D

  object3d.getWorldScale(place.scale)
  object3d.getWorldQuaternion(place.quaternion)
  object3d.getWorldPosition(place.position)
  
  return place
}

// only works with untransformed entity parent
function applyPlacement(place, entity) {
  let entity3d = entity.object3D
  entity3d.scale.copy(place.scale)
  entity3d.quaternion.copy(place.quaternion)
  entity3d.position.copy(place.position)
}

function positionRelativeTo(entity, referenceObject3d) {
  let relativePositionInLocalScale = referenceObject3d.worldToLocal(entity.object3D.getWorldPosition())
  let scale = referenceObject3d.scale
  let inNormalisedScale = {
    x: relativePositionInLocalScale.x * scale.x,
    y: relativePositionInLocalScale.y * scale.y,
    z: relativePositionInLocalScale.z * scale.z
  }
  return inNormalisedScale
}

function inDegrees(radians) {
  return THREE.Math.radToDeg(radians)
}

let matrixCopy = (matrix) => new THREE.Matrix4().copy(matrix)

const identityMatrix = new THREE.Matrix4().identity()

function reparent(entity, newParent, done) {
  let intendedWorldMatrix = matrixCopy(entity.object3D.matrixWorld) // this encodes starting pos, rot and scale of entity being moved
  entity.parentElement.removeChild(entity)

  let reparented = entity.cloneNode()
  newParent.appendChild(reparented)

  reparented.addEventListener('loaded', () => {
    // based on parent-world.local matrix multiplication order for child's world matrix:
    //   https://github.com/mrdoob/three.js/blob/dev/src/core/Object3D.js#L560
    //
    // determine required child local matrix thus:
    //   https://math.stackexchange.com/questions/949341/how-to-find-matrix-b-given-matrix-ab-and-a          
    let recalculatedLocalMatrix = new THREE.Matrix4().getInverse(newParent.object3D.matrixWorld).multiply(intendedWorldMatrix)

    let matrixAutoUpdate = reparented.object3D.matrixAutoUpdate
    reparented.object3D.matrixAutoUpdate = false // so that local matrix doesn't get trashed on tick while updating 
    reparented.object3D.matrix.copy(recalculatedLocalMatrix)
    reparented.object3D.applyMatrix(identityMatrix) // to set pos, rot, scale from matrix
    reparented.object3D.matrixAutoUpdate = matrixAutoUpdate
    newParent.object3D.updateMatrixWorld() // ensure all world matrices around moved entity are consistent

    done()
  })
  return reparented
}
