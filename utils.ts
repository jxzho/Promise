export function isObject (val: any) {
  return val !== null && typeof val === 'object'
}

export function isFn (val: any) {
  return typeof val === 'function'
}

export function isPromise (val: any)  {
  if (isObject(val) || isFn(val)) {
    return isFn(val.then)
  } else {
    return false
  }
}