import FlightController from '../src'
import { read16 } from './utils/functions'

class FC extends FlightController {
  getServos(): Promise<any> {
    return this.write(103).then(data => read16(data))
  }
}
const fc = new FC('COM3')

fc.on('initialize', async () => {
  try {
    const values = await fc.getServos()
    console.log(values)
    fc.destroy()
  } catch (error) {
    // error
  }
})
