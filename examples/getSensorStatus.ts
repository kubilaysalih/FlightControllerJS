import FlightController from '../src'

interface Status {
  hardwareHealthy: number
  gyroscope: number
  accelerometre: number
  magnetometre: number
  barometre: number
  gps: number
  range: number
  speed: number
  flow: number
}

class FC extends FlightController {
  getSensorStatus(): Promise<Status> {
    return this.write(151).then(data => {
      const status: Status = {
        hardwareHealthy: data[0],
        gyroscope: data[1],
        accelerometre: data[2],
        magnetometre: data[3],
        barometre: data[4],
        gps: data[5],
        range: data[6],
        speed: data[7],
        flow: data[8]
      }
      return status
    })
  }
}

const fc = new FC('COM3')

fc.on('initialize', async () => {
  try {
    const values: Status = await fc.getSensorStatus()
    console.log(`accelerometre: ${values.accelerometre}\ngyroscope: ${values.gyroscope}`)
    fc.destroy()
  } catch (error) {
    // error
  }
})
