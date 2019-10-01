import FlightController from '../src'
import { read16 } from './utils/functions'

class FC extends FlightController {
  getMotors(): Promise<number[]> {
    return this.write(104).then(data => read16(data))
  }
}

const fc = new FC('COM3')

fc.on('initialize', async () => {
  try {
    const values = await fc.getMotors()
    console.log(values)
    fc.destroy()
  } catch (error) {
    // error
  }
})
