// https://github.com/nodejs/node/issues/20893#issuecomment-392134644
import { EventEmitter } from 'events'

declare module 'events' {
  interface EventEmitter {
    await(resolveEvent: any, rejectEvent?: any): Promise<any>
  }
}

EventEmitter.prototype.await = function(resolveEvent: any, rejectEvent?: any): Promise<any> {
  let _resolve, _reject
  const promise = new Promise((resolve: any, reject?: any): void => {
    _resolve = resolve
    this.on(resolveEvent, resolve)
    if (rejectEvent) {
      _reject = reject
      this.on(rejectEvent, reject)
    }
  })

  return rejectEvent
    ? promise.finally(() => {
        this.off(resolveEvent, _resolve)
        this.off(rejectEvent, _reject)
      })
    : promise.finally(() => {
        this.off(resolveEvent, _resolve)
      })
}
