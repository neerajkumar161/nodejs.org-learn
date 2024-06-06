/**
 * https://nodejs.org/en/learn/asynchronous-work/understanding-processnexttick
 * Understanding process.nextTick()
 * As we try to understand the event loop, one important part of it is process.nextTick().
 * Every time the event loop takes a full trip, we call it a tick.
 * That means, 1 event loop execution = 1 tick;
 *
 * When we pass a function to process.nextTick(), we instruct the engine to invoke this function at the end of the current operation, before next loop tick starts.
 *
 * The event loop is busy processing the current tasks execution. When this operation ends the JS engine runs all the functions passed to process.nextTick calls during that operation.
 *
 * means, run as soon as possible, but after the current operation completes, not in the queue.
 *
 * setTimeout() functions will executes at the end of next tick. much later after the process.nextTick executes.
 * Which prioritize the process.nextTick() over setTimeout().
 *
 * Use nextTick(), when you want to make sure that in the next tick operation is already executed.
 *
 * An example of order of events:
 *
 */

export function processDotNextTick() {
  console.log('Running 1st');

  setTimeout(() => console.log('Running at setTimeout -> 4th'), 0);
  setImmediate(() => console.log('Running at setImmediate -> 3rd'));
  process.nextTick(() => console.log('Running at nextTick -> 2nd'));
}

export function setImmediateFn() {
  /**
   * When you want to execute some code asap one option is to use setImmediate() function provided by Node.js
   * Any fn passed as a setImmediate argument is a callback that will executed in the next tick.
   *
   * Difference b/w setImmediate() and setTimeout(), process.nextTick() and promises:
   *
   * setImmediate(() => {}) == setTimeout(() => {}, 0), and there execution depends on the various factors. but they will always executes in the next iteration of the loop.
   *
   * Here is the flow:
   *
   * process.nextTick() added to process.nextTick queue
   * promise.then() added to the microtask queue
   * setImmediate and setTimeout added to the macrotask queue.
   *
   * Priority --> process.nextTick queue > microtask queue > macrotask queue
   *
   * Here is the example to show difference b/w them:
   *
   */

  const foo = () => console.log('foo');
  const zoo = () => console.log('zoo');
  const baz = () => console.log('baz');

  const start = () => {
    console.log('start');
    setImmediate(baz);

    new Promise((resolve, reject) => {
      resolve('bar');
    }).then((resolve) => {
      console.log(resolve);
      process.nextTick(zoo);
    });

    process.nextTick(foo);
    setTimeout(() => {
      console.log('setTimoeut');
    }, 0);
  };

  start();
  // start, foo, bar, zoo, baz, setTimoeut -> only on commonJS module, 
  // ESM will lead to promise resolve first before process.nextTick(foo); // start bar, foo, zoo, baz, setTimeout
}
