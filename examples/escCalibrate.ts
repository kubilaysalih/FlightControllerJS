import FlightController from '../src'
import { push16 } from './utils/functions'
import { createInterface } from 'readline'

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
})

class FC extends FlightController {
  step(prompt = ''): Promise<string> {
    return new Promise((resolve): void => {
      readline.question(prompt, (value): void => {
        resolve(value)
      })
    })
  }
}

const fc = new FC('COM3')

fc.on('initialize', async () => {
  try {
    const motors1000 = push16([1000, 1000, 1000, 1000, 0, 0, 0, 0])
    const motors2000 = push16([2000, 2000, 2000, 2000, 0, 0, 0, 0])

    console.log('ESC Calibrate')
    await fc.step('Press enter to continue. \n')
    await fc.step('Remove the battery. \n')
    fc.write(214, motors2000)
    await fc.step('Insert the battery.\n')
    fc.write(214, motors1000)
    await fc.step('ESC is calibrating. \n')
    console.log('Press enter to exit. \n')
    await fc.step('')
    fc.destroy()
    process.exit(1)
  } catch (error) {
    // error
  }
})
