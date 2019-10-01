import FlightController from '../src'

class FC extends FlightController {
  getBoardInfo(): Promise<string> {
    return this.write(5).then(data => String.fromCharCode(...data))
  }
}
const fc = new FC('COM3')

fc.on('initialize', async () => {
  try {
    const values = await fc.getBoardInfo()
    console.log(values)
    fc.destroy()
  } catch (error) {
    // error
  }
})
