import FlightController from '../src'

class FC extends FlightController {
  resetConf(): Promise<void> {
    return this.write(208)
  }
}
const fc = new FC('COM3')

fc.on('initialize', async () => {
  try {
    await fc.resetConf()
    console.log('Configurator has reset.')
    fc.destroy()
  } catch (error) {
    // error
  }
})
