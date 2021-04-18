import routeConfig from './src/api/route-config.yml'

const { findRoute } = require('./src/api/helpers/request-handler')
const { generateRoutes } = require('./src/api/helpers/generate-routes')
// const uiServer = require('./docs-server/ui-server')
// const host = 'localhost'
// const port = 3001
const dynamicRequire = (controller) => require(`./src/api/controllers/${controller}.js`)
const ISLOCAL = false
// function sendResponse (res) {
//   return (status, json = null) => {
//     return {
//       statusCode: status,
//       body: JSON.stringify(
//         json,
//         null,
//         2
//       )
//     }
//     // res.setHeader('Content-Type', 'application/json')
//     // res.setHeader('Access-Control-Allow-Headers', '*')
//     // res.setHeader('Access-Control-Allow-Origin', '*')
//     // res.setHeader('Access-Control-Allow-Methods', '*')

//     // res.writeHead(status)

//     // if (json) {
//     //   res.end(JSON.stringify(json))
//     // } else {
//     //   res.end()
//     // }
//   }
// }

async function requestListener (req) {
  // console.log(req, res)

  // const send = sendResponse(res)
  const routes = generateRoutes(routeConfig)

  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      body: 'err3',
      isBase64Encoded: false
    }
  }
  const body = req.data

  // if (ISLOCAL && !body && (req.method === 'POST' || req.method === 'PATCH')) {
  //   body = await new Promise((resolve) => {
  //     const chunks = []
  //     req.on('data', chunk => chunks.push(chunk))
  //     req.on('end', () => {
  //       const data = Buffer.concat(chunks)
  //       resolve(JSON.parse(data.toString()))
  //     })
  //   })
  // }

  let response
  try {
    response = findRoute(routes, req.url, req.method)
  } catch (err) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      body: req.url + ' ' + err.toString(),
      isBase64Encoded: false
    }
  }

  try {
    const result = await dynamicRequire(response.controller)[response.operation]({ ...response, data: body })
    return {
      statusCode: result.status,
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.json),
      isBase64Encoded: false
    }
  } catch (err) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ test: 's' }),
      isBase64Encoded: false
    }
  }
}

const serve = async (event, context, callback) => {
  const res = await requestListener({
    method: event.requestContext.httpMethod,
    url: event.requestContext.path.replace('/dev', ''),
    data: event.body ? JSON.parse(event.body) : {}
  })
  callback(null, res)
}

export default serve
