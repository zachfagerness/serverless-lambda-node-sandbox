const http = require('http')
const fs = require('fs')
const path = require('path')

const host = 'localhost'
const port = 3000

function serverListener (req, res) {
  res.setHeader('Content-Type', 'text/html')
  const readStream = fs.createReadStream(path.join(__dirname, './index.html'))

  readStream.on('open', () => {
    readStream.pipe(res)
  })

  readStream.on('error', (err) => {
    res.end(err)
  })
}

const server = http.createServer(serverListener)

function serve () {
  server.listen(port, host, () => {
    console.log(`UI server is running on http://${host}:${port}`)
  })
}
serve()
module.exports = {
  serve
}
