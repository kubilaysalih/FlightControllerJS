import FlightController from '../src'
import { read16 } from './utils/functions'

interface Debug {
  debug0: number
  debug1: number
  debug2: number
  debug3: number
}

class FC extends FlightController {
  getDebug(): Promise<Debug> {
    return this.write(254).then(data => {
      const tempArray = read16(data)

      const debug: Debug = {
        debug0: tempArray[0],
        debug1: tempArray[1],
        debug2: tempArray[2],
        debug3: tempArray[3]
      }
      return debug
    })
  }
}

const fc = new FC('COM3')

fc.on('initialize', async () => {
  try {
    const values: Debug = await fc.getDebug()
    console.log(
      `Debug 0: ${values.debug0}\nDebug 1: ${values.debug1}\nDebug 2: ${values.debug2}\nDebug 3: ${values.debug3}`
    )
    fc.destroy()
  } catch (error) {
    // error
  }
})
