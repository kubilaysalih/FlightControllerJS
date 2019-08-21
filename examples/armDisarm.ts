import FlightController from '../src'

const push16 = (values): number[] => {
  const array = []
  for (let index = 0; index < values.length; index++) {
    array.push(0x00ff & values[index])
    array.push(values[index] >> 8)
  }
  return array
}

class FC extends FlightController {
  roll = 1500

  pitch = 1500

  yaw = 1500

  throttle = 885

  aux1 = 1000

  aux2 = 1000

  aux3 = 1000

  aux4 = 1000

  armObject

  initialAuxValue = 900

  runInterval: NodeJS.Timeout

  modeRangesHandler(rawData): number[][] {
    const groupedValues = []
    let array = []
    rawData.forEach(element => {
      if (array.length === 4) {
        if (!array.every(e => e === 0)) groupedValues.push(array)
        array = [element]
      } else {
        array = [...array, element]
      }
    })
    return groupedValues
  }

  boxNamesHandler(rawData): string[] {
    const groupedValues = []
    let str = ''
    rawData.forEach(element => {
      if (element !== 59) {
        str += String.fromCharCode(element)
      } else {
        groupedValues.push(str)
        str = ''
      }
    })
    return groupedValues
  }

  arm = async (): Promise<any> => {
    try {
      const modeRangesPromise = await this.write(34)
      const boxNamesPromise = await this.write(116)

      const armPromise = Promise.all([modeRangesPromise, boxNamesPromise]).then(() => {
        return new Promise((resolve): void => {
          if (!modeRangesPromise || !boxNamesPromise) throw new Error('Cannot can information about arm values.')

          const modeRanges = this.modeRangesHandler(modeRangesPromise)
          const boxNames = this.boxNamesHandler(boxNamesPromise)

          const armValues = modeRanges.find(e => e[0] === boxNames.findIndex(e => e === 'ARM'))

          if (!armValues)
            throw new Error(
              'No arm range has been entered for the operation. Please specify a range from your configurator'
            )

          const armObject = {
            channel: `aux${armValues[1] + 1}`,
            range: [this.initialAuxValue + armValues[2] * 25, this.initialAuxValue + armValues[3] * 25]
          }

          const averageValue = (armObject.range[0] + armObject.range[1]) / 2

          const increaser = setInterval(() => {
            if (this[armObject.channel] < averageValue) {
              this[armObject.channel] += (averageValue - 1000) / 10
              return
            }
            clearInterval(increaser)
            resolve()
          }, 100)

          this.armObject = armObject
        })
      })

      return armPromise
    } catch (error) {
      throw new Error('Cannot get information about arm values.')
    }
  }

  disarm = (callback?: Function): any => {
    const firstAuxValue = this[this.armObject.channel]
    const decreaser = setInterval(() => {
      if (this[this.armObject.channel] > 1000) {
        this[this.armObject.channel] -= (firstAuxValue - 1000) / 10
        return
      }
      if (callback) callback()
      clearInterval(decreaser)
    }, 100)
  }

  setRawRx(channels): void {
    const buffer = push16(channels)
    this.write(200, buffer)
  }

  run(): void {
    this.runInterval = setInterval(() => {
      this.setRawRx([this.roll, this.pitch, this.throttle, this.yaw, this.aux1, this.aux2, this.aux3, this.aux4])
    }, 50)
  }

  stop(): void {
    clearInterval(this.runInterval)
  }
}

const fc = new FC('/dev/ttyACM0')

fc.on('initialize', async () => {
  fc.run()
  try {
    await fc.arm()
    setTimeout(() => {
      fc.disarm()

      fc.destroy()
    }, 3000)
  } catch (error) {
    // error
  }
})
