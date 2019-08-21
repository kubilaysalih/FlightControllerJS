import FlightController from '../src'

class FC extends FlightController {
  getName(): Promise<string> {
    return this.write(10).then((name): string => String.fromCharCode(...name))
  }

  setName(name: string): this {
    const array = []
    for (let index = 0; index < name.length; index++) {
      array.push(name.charCodeAt(index))
    }
    this.write(11, array)
    return this
  }
}

const fc = new FC('/dev/ttyACM0')

fc.on('initialize', async () => {
  try {
    // first get the craft name
    console.log(await fc.getName())

    // wait a little
    setTimeout(async () => {
      // then set craft name
      await fc.setName('exampleCraftName')

      // get the changed name
      console.log(await fc.getName())
    }, 1000)

    fc.destroy()
  } catch (error) {
    // error
  }
})
