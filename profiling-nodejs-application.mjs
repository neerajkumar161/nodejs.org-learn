/**
 * https://nodejs.org/en/learn/getting-started/profiling
 * There are many third party tools available for profiling Node.js applications but, in many cases, the easiest option is to use the Node.js built-in profiler.
 * The built-in profiler uses the profiler inside V8 which samples the stack at regular intervals during program execution.
 * It records the results of these samples, along with important optimization events such as jit compiles, as a series of ticks:
 */
import crypto from 'node:crypto'
import http from 'node:http'

const users = {}

const server = http.createServer((req, res) => {
  const url = req.url
  if (url === '/newUser') {
    let username = req.query.username || ''
    const password = req.query.password || ''

    username = username.replace(/[!@#$%^&*]/g, '')

    if (!username || !password || users[username]) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Bad Request' }))
      return
    }

    const salt = crypto.randomBytes(128).toString('base64')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512')

    users[username] = { salt, hash }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
  }

  if (url === '/auth') {
    let username = req.query.username || ''
    const password = req.query.password || ''

    username = username.replace(/[!@#$%^&*]/g, '')

    if (!username || !password || users[username]) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Bad Request' }))
      return
    }

    const { salt, hash } = users[username]
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512') // This function should be async for larger user base

    crypto.pbkdf2(password, salt, 10000, 512, 'sha512', (err, hash) => {
      if (hash.toString() === users[username].hash.toString()) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ success: 'Authenticated' }))
        return
      } else {
        res.statusCode = 401
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Bad Request' }))
        return
      }
    })
  }

  res.statusCode = 500
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})

server.listen(3000, () => console.log(`Server is listening on port 3000`))

// curl -X GET "http://localhost:3000/newUser?username=neeraj&password=password"
// ab -k -c 20 -n 2500 "http://localhost:3000/auth?username=neeraj&password=password"
