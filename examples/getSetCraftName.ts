import FlightController from '../src'
import Code from '../src/typings/code'

const fc = new FlightController('/dev/ttyACM0')

const CODES: Record<string, Code> = {
  MSP_NAME: {
    code: 10,
    responseHandler: (response): string => {
      return String.fromCharCode(...response)
    }
  },
  MSP_SET_NAME: {
    code: 11,
    requestHandler: (data): Array<number> => {
      const array = []
      for (let index = 0; index < data.length; index++) {
        array.push(data.charCodeAt(index))
      }
      return array
    }
  }
}

fc.on('initialize', async () => {
  try {
    // first get the craft name
    console.log(await fc.send(CODES.MSP_NAME))

    // wait a little
    setTimeout(async () => {
      // then set craft name to another
      await fc.send(CODES.MSP_SET_NAME, 'exampleCraftName')

      // get the changed name
      console.log(await fc.send(CODES.MSP_NAME))

      fc.destroy()
    }, 1000)
  } catch (error) {
    // error
  }
})
