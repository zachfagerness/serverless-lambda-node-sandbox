
function generateRoutes (routes) {
  const innerReduce = (pathMap, [path, pathDetails]) => {
    const regex = new RegExp(`^${path.replace(/:\w+/g, '([^/]+)')}$`)
    const matchedKeys = path.match(regex)
    const pathKeys = matchedKeys.splice(1, matchedKeys.length - 1).map(key => key.replace(':', ''))
    pathMap.set(regex, {
      path,
      pathKeys,
      ...pathDetails
    })
    return pathMap
  }

  return Object.entries(routes.paths).reduce(innerReduce, new Map())
}

// function writeJson () {
//   const routes = generateRoutes(yml)
//   fs.writeFileSync(path.join(__dirname, '../route-config.js'), JSON.stringify(Array.from(routes), (key, value) => {
//     console.log(key, value.toString())
//     if (value.toString().includes('/users')) {
//       return value.toString()
//     }
//     return value
//   }))
// }
// console.log('asd')
module.exports = {
  generateRoutes
}
// writeJson()
