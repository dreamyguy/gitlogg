/**
 * Concurrent promise map implementation.
 * Runs at most max promises at once.
 * 
 * If this is too much bloat in the codebase, it can be replaced with
 * Bluebird's `Promise.map` http://bluebirdjs.com/docs/api/promise.map.html
 * or https://github.com/vilic/promise-pool
 * or https://github.com/timdp/es6-promise-pool
 */
export function mapConcurrent(all, cb, max) {
  return new Promise((resolve, reject) => {
    if(all.length === 0) return [];
    if(max < 1) throw new Error('max must be >= 1');

    let halt = false, running = 0, next = 0, total = all.length, output = [];
    while(running < max && next < total) startNext();
    function startNext() {
      running++;
      const i = next++;
      const promise = cb(all[i], i, all);
      Promise.resolve(promise).then(v => halt || resolveOne(i, v), rejectOne);
    }
    function resolveOne(index, val) {
      output[index] = val;
      running--;
      if(next < total) {
        startNext();
      } else if(!running) {
        resolve(output);
      }
    }
    function rejectOne(err) {
      halt = true;
      reject(err);
    }
  });
}