/**
 * Internals of Node.js threads: Event Loop and Worker Pool.
 * 
 * https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop
 * 
 * Why should I avoid blocking the Event Loop and the Worker Pool?
 * Node.js uses small number of threads to handle many client.
 * 
 * In Node.js, there are two types of threads
 *  - Event Loop (aks as main loop, main thread or event thread)
 *  - Worker Pool (also known as thread pool) - A pool of k workers in Worker pool.
 * 
 * If thread is taking a long time to execute the callback(event loop) or a heavy task(worker pool), we call it a BLOCKED. While thread is blocked working for a single client, it cannot handle requests from any other clients.
 * 
 * This provides two motivations to block neither Event Loop or Worker Pool:
 *  1. Performance: If you regularly perform heavy task in either type of thread i.e Event Loop or Worker Pool, the throughput (requests/second) of your server will suffer.
 * 2. Security: If it is possible that for certain type of input one of your thread might block, a malicious client could submit the "evil input", and make your thread block, and keep them from working on other clients. This would be a Denial of Service(DoS) attack.
 * 
 * Node.js uses Event Driven Architecture: It has an Event Loop for callbacks and Network I/O tasks and Worker Pool for expensive tasks.
 * What does it mean EDA(Event Driven Architecture)?
 * EDA is a Software Design Pattern that enables us to detect "events" and act on them in real time or nearly real time.
 * An event is a change in state, like update, delete, insert, etc. It could be any type of change.
 * 
 * What code runs on Event Loop?
 *  - First requiring all modules
 *  - Register callbacks for events.
 *  - Node.js then enter the Event Loop and listen to incoming requests and executes appropriate callbacks.
 *    
 *  - Callbacks can be synchronous or asynchronous. For eg: [fs.readFile() is asynchronous, fs.readFileSync() is synchronous]
 *  - Execute Non-blocking asynchronous code like network I/O.
 * 
 *  In Summary, Event Loop thread do these things:
 *    1. Executes JavaScript callbacks, either synchronous or asynchronous.
 *    2. Executes Non Blocking Asynchronous tasks like Network I/O call or fs.readFile().
 * 
 * What code runs on Worker Pool?
 *  - Worker Pool in implemented in libuv which exposes general task submission API.
 *  - Handles "expensive" tasks. This includes I/O for which an OS does not provide Async | Non-Blocking versions.
 *  - Also handles CPU intensive tasks.
 * 
 * These are the Node.js module APIs that uses the Worker Pool:
 *  1. I/O Intensive Tasks
 *    - DNS: dns.lookup(), dns.lookupService().
 *    - File System: All files system except fs.FSWatcher() and those are explicitly synchronous.
 * 2. CPU Intensive Tasks
 *    - Crypto: crypt.pbkdf2(), crypto.scrypt(), crypto.randomBytes(), crypto.randomFillSync(), crypto.generateKeyPair().
 *    - Zlib: All zlib APIs except those are explicitly synchronous.
 * 
 * How does Node.js decide what code to run next?
 *   - Abstractly, the Event Loop and Worker Pool maintain queues for pending events and tasks, respectively.
 *   
 *   - In truth, Event loop does not actually maintain queue. Instead it is collection of file descriptors that is asks Operating System to monitor using mechamism like epoll(linux), kqueue(macOS), event ports(Solaris) and IOCP(Windows)
 *    - These file descriptors correspond to network sockets, any file it is watching, and so on.
 *    - When OS says that one of these file descriptors is read, Event Loop will translate it into appropriate event and invokes the callback(s) associated with that event.
 * 
 *    - In contrast, Worker Pool uses real queue whose entries are tasked to be processed. A Worker Pool pops tasks from the queue and executes them, and when is finished, Worker pool raises "Atlease one task is finished" event to Event loop.
 * 
 * Blocking the Event Loop: Node.js core modules
 *    - All above sync versions.
 *    - JSON.stringify() and JSON.parse() for large objects. This operation in expensive for larger objects.
 * 
 * Read more about Offloading and Partitioning (child_process or Cluster module)
 */
