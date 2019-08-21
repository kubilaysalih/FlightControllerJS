import { Transform } from 'stream'

class Parser extends Transform {
  buffer: Buffer

  constructor() {
    super()
    this.buffer = Buffer.alloc(0)
  }

  _transform(chunk: Buffer, encoding, cb: Function): void {
    let data: Buffer = Buffer.concat([this.buffer, chunk])
    while (data.indexOf(36) !== -1) {
      if (data[0] === 36) {
        this.push(data.slice(0, [...data][3] + 6))
      }
      data = Buffer.alloc(0)
    }
    this.buffer = data
    cb()
  }

  _flush(cb: Function): void {
    this.push(this.buffer)
    this.buffer = Buffer.alloc(0)
    cb()
  }
}

export default Parser
