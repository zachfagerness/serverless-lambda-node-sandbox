import routeConfig from './src/api/route-config.yml'
import http from 'http'

const { findRoute } = require('./src/api/helpers/request-handler')
const { generateRoutes } = require('./src/api/helpers/generate-routes')
import uiServer from './docs-server/ui-server'
const host = '0.0.0.0'
const port = 3000
const dynamicRequire = (controller) => require(`./src/api/controllers/${controller}.js`)
const ISLOCAL = true


async function requestListener (req) {
  const routes = generateRoutes(routeConfig)

  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      body: 'err3',
    }
  }
  let body = req.data

  if (ISLOCAL && !body && (req.method === 'POST' || req.method === 'PATCH')) {
    body = await new Promise((resolve) => {
      const chunks = []
      req.on('data', chunk => chunks.push(chunk))
      req.on('end', () => {
        const data = Buffer.concat(chunks)
        resolve(JSON.parse(data.toString()))
      })
      
    })
  }

  let response
  try {
    response = findRoute(routes, req.url, req.method)
  } catch (err) {
    return {
      statusCode: 200,
      body: req.url + ' ' + err.toString(),
    }
  }

  try {
    const result = await dynamicRequire(response.controller)[response.operation]({ ...response, data: body })
    return {
      statusCode: result.status,
      body: JSON.stringify(result.json),
    }
  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({ test: 's' }),
    }
  }
}

async function lambdaHandler  (event, context, callback) {
  const res = await requestListener({
    method: event.requestContext.httpMethod,
    url: event.requestContext.path.replace('/dev', ''),
    data: event.body ? JSON.parse(event.body) : {}
  })
  callback(null, {
    ...res,
    headers: {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*'
    },
    isBase64Encoded: false
  })
}

async function localServe (){
  http.createServer(async (req, res)=>{
    console.log(req.url)
    if(req.url.endsWith('/docs')){
      uiServer.serverListener(req, res)
      return
    }
    const response = await requestListener(req)
    sendResponse(res, response.statusCode, response.body)
  }).listen(port, host, ()=>{
    console.log(`API server is rdudnndindg on http://${host}:${port}`)
  })
} 

function sendResponse (res, status, json = null) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')

  res.writeHead(status)
  json ? res.end(json) : res.end()
}

if(ISLOCAL){
  localServe()
}

export {
  lambdaHandler
}
