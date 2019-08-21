import SerialPort from 'serialport'
import { EventEmitter } from 'events'
import Code from './typings/code'
import Parser from './parser'
import './eventEmitter'

export = class FlightController {
  private _eventEmitter: EventEmitter

  private _connection: SerialPort

  constructor(private path: string) {
    const eventEmitter = new EventEmitter()

    const parser = new Parser()

    const connection = new SerialPort(path, {
      baudRate: 115200
    })

    connection.pipe(parser)

    connection.on('open', () => {
      eventEmitter.emit('initialize')
    })

    parser.on('data', data => {
      this.responseHandler(data)
    })

    this._eventEmitter = eventEmitter
    this._connection = connection
  }

  public on(event: string | symbol | number, func: (...args: any[]) => void): void {
    this._eventEmitter.on(event.toString(), func)
  }

  private responseHandler(data: Buffer): void {
    const type = [...data][4]
    const rawData = [...data].slice(5, [...data].length - 1)
    this._eventEmitter.emit('data', rawData)
    this._eventEmitter.emit(type.toString(), rawData)
  }

  public write(code: number, data?): Promise<any> {
    const size: number = data ? data.length + 6 : 6
    const buffer = Buffer.alloc(size)

    let checksum = 0

    buffer[0] = 36
    buffer[1] = 77
    buffer[2] = 60
    buffer[3] = size - 6
    buffer[4] = code

    checksum = buffer[3] ^ buffer[4]

    if (data) {
      for (let i = 0; i < data.length; i++) {
        checksum ^= buffer[i + 5] = data[i]
      }
      buffer[5 + data.length] = checksum
    } else {
      buffer[5] = checksum
    }

    this._connection.write(<Buffer>buffer, err => {
      if (err) throw 'Cannot write to port ' + err
    })

    return this._eventEmitter.await(code.toString())
  }

  public send(obj: Code, data?): Promise<Promise<void>> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const response = await this.write(obj.code, obj.requestHandler ? obj.requestHandler(data) : data)
          resolve(obj.responseHandler ? obj.responseHandler(response) : response)
        } catch (error) {
          console.log(error)
          reject(error)
        }
      }
    )
  }

  public destroy(): void {
    this._eventEmitter.removeAllListeners()
    this._connection.destroy()
  }
}
