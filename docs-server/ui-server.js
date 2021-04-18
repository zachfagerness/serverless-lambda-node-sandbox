const fs = require('fs')
const path = require('path')

function serverListener (req, res) {
  res.setHeader('Content-Type', 'text/html')
  const readStream = fs.createReadStream(path.join(process.cwd(), './docs-server/index.html'))

  readStream.on('open', () => {
    readStream.pipe(res)
  })

  readStream.on('error', (err) => {
    res.end(err)
  })
}

module.exports = {
  serverListener
}
