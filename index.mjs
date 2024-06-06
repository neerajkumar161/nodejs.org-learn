import { setImmediateFn } from './process.nextTick.mjs'

// Use command cmd + shift + B to execute the index.mjs file
function callFunction(fns) {
  if (!fns.length) {
    console.log('first function is empty')
    return
  }
  console.log('Calling from index.mjs file:', fns[0])
  fns[0]()
}

const functions = [
  // asynchronousWork,
  // linkedInAPI,
  // nodeJSEventLoop,
  // eventEmitterFn,
  // processDotNextTick,
  setImmediateFn,
]

callFunction(functions)
