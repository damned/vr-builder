/* global THREE */

function collider(collidee) {
  return collidee.components["aabb-collider"];
}

const axisLockMarginFactor = 0.15;

function withinAxisLockMargin(n, distance) {
  let margin = axisLockMarginFactor * distance;
  return n >= -margin && n <= margin;
}

function getResizeVector(resizeFactor, resizerRelativePosition) {
  let x = resizerRelativePosition.x,
    y = resizerRelativePosition.y,
    z = resizerRelativePosition.z;
  let roughDistance = Math.abs(x) + Math.abs(y) + Math.abs(z);

  let xFactor = resizeFactor;
  let yFactor = resizeFactor;
  let zFactor = resizeFactor;

  let noX = withinAxisLockMargin(x, roughDistance);
  let noY = withinAxisLockMargin(y, roughDistance);
  let noZ = withinAxisLockMargin(z, roughDistance);

  if (noY && noZ) {
    yFactor = 1;
    zFactor = 1;
  } else if (noX && noZ) {
    xFactor = 1;
    zFactor = 1;
  } else if (noX && noY) {
    xFactor = 1;
    yFactor = 1;
  }
  return new THREE.Vector3(xFactor, yFactor, zFactor);
}

function entityInfo(entity) {
  let pos = entity.object3D.position;
  let position = () => { return `pos: ${pos.x.toFixed(2)} ${pos.y.toFixed(2)} ${pos.z.toFixed(2)}` }
  let rotation = () => { return `rot: ${safeStringify(entity.getAttribute('rotation'))}` }
  let scale = () => { return `scale: ${safeStringify(entity.getAttribute('scale'))}` }
  return [entity.tagName, position(), rotation(), scale()].join('\n')
}

var clogPrefix = null
function clog(...args) {
  console.log(args[0]);
  let formatted = [];
  args.forEach(arg => {
    let argType = typeof arg
    if (argType == 'string') {
      formatted.push(arg);      
    }
    else if (arg instanceof Error) {
      formatted.push(arg.toString() + '\n' + arg.stack);
    }
    else if (argType == 'object') {
      if (arg.tagName) {
        formatted.push(entityInfo(arg))
      }
      else {
        formatted.push(safeStringify(arg))
      }
    }
    else {
      formatted.push(arg);
    }
  });
  let $logPanel = $("#ddd")
  let logValue
  if (clogPrefix == args[0] ) {
    logValue = $logPanel.attr('value') + '\n'
  }
  else {
    logValue = ''    
  }
  logValue += formatted.join("\n")
  clogPrefix = args[0]
  $logPanel.attr("value", logValue);
}

function catching(fn) {
  try {
    fn();
  } catch (e) {
    clog("caught exception in catching", e);
  }
}

function globalErrorHandlingReady() {
  clog('awaiting errors...')
}

function setupGlobalErrorLogging() {
  window.addEventListener('error', (event) => {
    const {message, url, lineno, colno, error} = event
    var formatted = [
      "Message: " + message,
      "URL: " + url,
      "Line: " + lineno,
      "Column: " + colno,
      "Error object: " + JSON.stringify(error)
    ].join(" - ");

    clog(formatted);
    return false;
  })
  setTimeout(() => {
    setTimeout(globalErrorHandlingReady, 2000)
    throw new Error('testing testing 123')
  }, 2000)
}

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
const getCircularReplacer = () => {
  const seen = new WeakSet();
  let count = 0
  return (key, value) => {
    if (++count > 20) {
      return
    }
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

var safeStringify = (obj, indent = 2) => {
  return JSON.stringify(obj, getCircularReplacer(), indent)
}