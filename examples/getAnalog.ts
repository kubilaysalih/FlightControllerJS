import FlightController from '../src'

interface Analog {
  volt: number
  mAh: number
  rssi: number
}

class FC extends FlightController {
  getAnalog(): Promise<Analog> {
    return this.write(110).then(data => {
      const tempArray = []
      const length = data.length
      for (let index = 0; index < length; index = index + 2) {
        tempArray.push(data[index] + data[index + 1] * 256)
      }
      const analog: Analog = {
        volt: data[0],
        mAh: tempArray[0],
        rssi: tempArray[1]
      }

      return analog
    })
  }
}

const fc = new FC('COM3')

fc.on('initialize', async () => {
  try {
    const values: Analog = await fc.getAnalog()
    console.log(`volt: ${values.volt}\nmAh: ${values.mAh}\nrssi: ${values.rssi}`)
    fc.destroy()
  } catch (error) {
    // error
  }
})
