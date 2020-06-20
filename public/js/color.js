function radiansToHexPair(r) {
  let i = Math.floor((r + 1) * 128)
  let limited = Math.max(0, Math.min(i, 255))
  return '' + limited.toString(16)
}

function rotationToColor(rotation) {
  return '#' + radiansToHexPair(rotation.x) + radiansToHexPair(rotation.y) + radiansToHexPair(rotation.z)
}

function colorFromEntityRotation(entity) {
  return rotationToColor(entity.object3D.rotation) 
}
