import {Writable} from 'stream';

/** Stream that goes nowhere (like piping to /dev/null) */
export class NullStream extends Writable {
  constructor() {
    super({
      objectMode: true
    });
  }
  _write(_1, _2, done) {
    done();
  }
}