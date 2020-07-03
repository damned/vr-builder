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

function applyPlacement(place, entity) {
  entity.object3D.scale.copy(place.scale)
  entity.object3D.quaternion.copy(place.quaternion)
  entity.object3D.position.copy(place.position)
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