/**
 *
 * https://nodejs.org/en/learn/asynchronous-work/asynchronous-flow-control
 */
import fs from 'node:fs';

export function asynchronousWork() {
  function getSong() {
    let _song = '';
    let i = 100;
    for (i; i > 0; i -= 1) {
      _song += `${i} beers on the wall, you take one down and pass it around, ${i - 1} bottles of beer on the wall\n`;
      if (i === 1) {
        _song += "Hey let's get some more beer";
      }
    }
    return _song;
  }
  function singSong(_song) {
    if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
    console.log(_song);
  }
  const song = getSong();
  // this will work
  // singSong(song)

  // But if we use setTimeout instead, it will not work
  function getSongTwo() {
    let _song = '';
    let i = 100;
    for (i; i > 0; i -= 1) {
      /* eslint-disable no-loop-func */
      setTimeout(function () {
        _song += `${i} beers on the wall, you take one down and pass it around, ${i - 1} bottles of beer on the wall\n`;
        if (i === 1) {
          _song += "Hey let's get some more beer";
        }
      }, 0);
      /* eslint-enable no-loop-func */
    }
    return _song;
  }

  const songTwo = getSongTwo();
  // singSong(songTwo) // error

  /**
   * Why did this happen? setTimeout instructs the CPU to store the instructions elsewhere on the bus, and instructs that the data is scheduled for pickup at a later time.
   * Thousands of CPU cycles pass before the function hits again at the 0 millisecond mark, the CPU fetches the instructions from the bus and executes them.
   * The only problem is that song ('') was returned thousands of cycles prior.
   *
   * The same situation arises in dealing with file systems and network requests.
   * The main thread simply cannot be blocked for an indeterminate period of time-- therefore,
   * we use callbacks to schedule the execution of code in time in a controlled manner.
   *
   * You will be able to perform almost all of your operations with the following 3 patterns:
   * - In series
   * - In parallel
   * - In parallel with a limit (Limited parallel)
   */

  // 1. In series: functions will executed in strict sequential order, this one is most similar to for loops
  const operations = [
    {
      func: function (args, cb) {
        setTimeout(() => {
          cb(console.log('first function', args));
        }, 1000);
      },
      args: ['A', 'B']
    },
    {
      func: function (args, cb) {
        setTimeout(() => {
          cb(console.log('second function', args));
        }, 1000);
      },
      args: ['C', 'D']
    },
    {
      func: function (args, cb) {
        setTimeout(() => {
          cb(console.log('third function', args));
        }, 1000);
      },
      args: ['E', 'F']
    }
  ];

  function executeFunctionWithArgs(operation, callback) {
    // executes function
    const { func, args } = operation;
    func(args, callback);
  }

  function serialProcedure(operation) {
    // console.log(operation);
    if (!operation) process.exit(0);
    executeFunctionWithArgs(operation, function (result) {
      // continue after callback
      serialProcedure(operations.shift());
    });
  }

  // serialProcedure(operations.shift());

  /**
   * 2. In Parallel - when ordering is not an issue, such as emailing a list of 1,000,000 email recipients.
   */
  const recipients = [
    { name: 'John', email: 'john@tld' },
    { name: 'Jane', email: 'jane@tld' },
    { name: 'Lisa', email: 'lisa@tld' },
    { name: 'Smith', email: 'smith@tld' },
    { name: 'Homer', email: 'homer@tld' }
  ];

  function sendEmail(email, ms, callback) {
    setTimeout(() => {
      if (email.smtp.email == 'smith@tld') {
        callback(new Error('Failed to send email'));
      }
      console.log(`Sending email to ${email.smtp.name}`);
      callback(null);
    }, ms);
  }
  function dispatch(recipient, ms, callback) {
    sendEmail(
      {
        subject: 'Dinner Tonight',
        message: 'Are you free for dinner tonight?',
        smtp: recipient
      },
      ms,
      callback
    );
  }

  function final(result) {
    console.log(`Result: ${result.count} attempts & ${result.success} succeeded emails`);
    if (result.failed.length) console.log(`Failed to send to: \n${result.failed.join('\n')}\n`);
  }

  let success = 0;
  let failed = [];
  let count = 0;
  recipients.forEach(function (recipient) {
    dispatch(recipient, 1000, function (err) {
      if (!err) {
        success += 1;
      } else failed.push(recipient.email);

      count += 1;

      if (count === recipients.length) {
        final({ count, success, failed });
      }
    });
  });

  /**
   * 3. Limited Parallel: In Parallel with a limit, such as successfully emailing 1,000,000 recipients from a list of 10e7 users.
   */

  let successCount = 0;
  function final() {
    console.log(`Dispatched ${successCount} emails`);
    console.log('Finished!');
  }

  function getListOfNUsers(cb) {
    return cb(null, recipients.slice(0, 4));
  }
  function sendingOneMillionEmailsOnly() {
    getListOfNUsers(function (err, bigList) {
      if (err) throw err;

      function serial(recipient) {
        if (!recipient || recipient.length >= 100000) return final();

        dispatch(recipient, 2000, function (err) {
          console.log(sendingOneMillionEmailsOnly.name);
          if (!err) successCount += 1;
          serial(bigList.pop());
        });
      }

      serial(bigList.pop());
    });
  }

  // sendingOneMillionEmailsOnly();
  setTimeoutAndsetImmediate();

}

