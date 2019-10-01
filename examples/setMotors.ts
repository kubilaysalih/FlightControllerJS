import FlightController from '../src'
import { push16 } from './utils/functions'

class FC extends FlightController {
  setMotors(): number[] {
    const values = [1500, 1500, 1500, 1500, 0, 0, 0, 0]
    const array = push16(values)
    return array
  }
}

const fc = new FC('COM3')

fc.on('initialize', async () => {
  try {
    const values = await fc.setMotors()
    fc.write(214, values)
    fc.destroy()
  } catch (error) {
    // error
  }
})
