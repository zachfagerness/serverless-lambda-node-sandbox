function findRoute (routeMap, url, method) {
  for (const [routeRegex, routeDetails] of routeMap.entries()) {
    const found = url.match(routeRegex)
    if (found) {
      if (!routeDetails[method]) {
        throw new Error('Method is not used on route ' + routeDetails.path)
      }
      return {
        pathParams: _getPathParams(routeDetails, found),
        ...routeDetails[method]
      }
    }
  }
  throw new Error('Path not found')
}

function _getPathParams (routeDetails, pathMatch) {
  return routeDetails.pathKeys.reduce((accum, key, i) => {
    return {
      ...accum,
      [key]: pathMatch[i + 1]
    }
  }, {})
}

const API = {
  findRoute,
  _getPathParams
}

module.exports = API
