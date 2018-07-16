export function addURLPrefix(obj, prefix) {
  for (const propName in obj) {
    const item = obj[propName]
    if (typeof item === 'string') {
      obj[propName] = `${prefix}${item}`
      continue
    }
    addURLPrefix(obj[propName], prefix)
  }
}
