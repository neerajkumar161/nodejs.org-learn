/**
 * https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter
 * In browser we have different kind of interaction using events like mouse click, mouse hover, etc.
 * Same type of system in provided by Node.js in backend using 'events' module.
 *
 * This module provides EventEmitter class, which we'll use to handle our events.
 *
 */
import { EventEmitter } from 'node:events';
export function eventEmitterFn() {
  const eventEmitter = new EventEmitter();

  const callback = function(value) {
    console.log('myEvent was emitted', value);
  }
  eventEmitter.on('myEvent', callback);

  eventEmitter.emit('myEvent', 'Hello World!'); // use to emit the event
  eventEmitter.emit('myEvent', 'Hello World Two!!!'); // use to emit the event

  eventEmitter.once('onceEvent', (value) => {
    // use to add callback function to the event which will run only once
    console.log('onceEvent was emitted only once', value);
  });

  eventEmitter.emit('onceEvent', 'Hello World!'); // Only emitted once
  eventEmitter.emit('onceEvent', 'Hello World!'); // this will not be emitted

  eventEmitter.removeListener('myEvent', callback); // use to remove the listener // .off()
  // eventEmitter.removeAllListeners('myEvent') // will remove all listeners of the event
  eventEmitter.emit('myEvent', 'Hello World!!!'); // this will not be emitted, since listener is removed

  /**
   * There are other method also available
   */
}
