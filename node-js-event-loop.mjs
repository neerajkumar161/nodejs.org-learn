import EventEmitter from 'node:events';
import fs from 'node:fs';

/**
 * https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
 * The Node.js Event Loop.
 * Difference between setTimeout and setImmediate
 * */

export function nodeJSEventLoop() {
  /**
   * https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#close-callbacks
   * setImmediate(() => {}) ==> same as setTimeout(() => {}, 0)
   * But setImmediate will always execute first if its withing I/O cycle, for example: reading file
   * Independently of how many timers will be there, setImmediate will always execute first
   */

  fs.readFile('./resume-may-2024.pdf', (err, data) => {
    if (err) throw err;
    setTimeout(() => {
      console.log('Timeout!');
    }, 0);
    setTimeout(() => {
      console.log('Timeout2!');
    }, 0);
    setTimeout(() => {
      console.log('Timeout3!');
    }, 0);
    setImmediate(() => {
      console.log('Immediate!');
    });
  });

  // Immediate -> Timeout, Timeout2, Timeout3

  /**
   * process.nextTick()  [Highest Priority in the event loop execution]
   * It is a part of asynchronous API, it is technically not a part of the event loop
   * Instead, the nextTickQueue will be processed after the current operation is completed, regardless of the current phase of event loop.
   *
   * Any time you call process.nextTick() in a given phase, all callbacks passed to process.nextTick() will be resolved before the event loop continues.
   * This can create some bad situations because it allows you to "starve" your I/O be making recursive process.nextTick() calls, which prevents the event loop from reaching the 'poll' phase.
   *
   * Why would that be allowed?
   *
   */

  let bar;
  // this has an asynchronous signature, but calls callback synchronously
  function someAsyncApiCall(callback) {
    callback();
  }
  // the callback is called before `someAsyncApiCall` completes.
  someAsyncApiCall(() => {
    // since someAsyncApiCall hasn't completed, bar hasn't been assigned any value
    console.log('bar', bar); // undefined
  });
  bar = 1;

  // using process.nextTick, we can run all code before the next event loop
  let foo;
  function someAsyncApiCallTwo(callback) {
    process.nextTick(callback);
  }

  someAsyncApiCallTwo(() => {
    console.log('foo', foo);  // 1
  })

  foo = 1;

  /**
   * By placing the callback in a process.nextTick(), the script still has the ability to run to completion, allowing all the variables, functions, etc., to be initialized prior to the callback being called. 
   * It also has the advantage of not allowing the event loop to continue. It may be useful for the user to be alerted to an error before the event loop is allowed to continue.
   * 
   * process.nextTick() vs setImmediate()
   * - process.nextTick() - fires immediately on the same phase
   * - setImmediate() - fires on the following iteration or 'tick' of the event loop
   * 
   * In essence, the names should be swapped, process.nextTicke() fire more immediately than setImmediate(),
   * but this is an artifact of the past which is unlikely to change due to the potential breakage of existing applications that depend on it.
   * 
   * 
   * Why use process.nextTick()?
   * - Allow users to handler errors, clean up any unnecessary resources, or perhaps try the request again before event loop continues.
   * - At times it's necessary to allow a callback to run after the call stack is free but before the event loop continues.
   */

  // https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#why-use-processnexttick
  // One example to when extending the event-emitter and emitting the event into the constructor
  class MyEmitter extends EventEmitter {
    constructor() {
      super();
      this.emit('event');
    }
  }
  new MyEmitter().on('event', () => {
    console.log('An event is occured!');  // Nothing will happen, so to resolve this we can use process.nextTick()
  })

  /**
   * You can't emit an event from the constructor immediately because the script will not have processed to the point where the user assigns a callback to that event. 
   * So, within the constructor itself, you can use process.nextTick() to set a callback to emit the event after the constructor has finished, which provides the expected results:
   */

  class MyAnotherEmitter extends EventEmitter {
    constructor() {
      super();

      process.nextTick(() => {
        this.emit('event');
      })
      // setImmediate(() => {  
      //   this.emit('event');
      // })
    }
  }

  new MyAnotherEmitter().on('event', () => {
    console.log('An event is occured in My AnotherEmitter!'); // Works as expected!
  })
}
