export const read16 = (array: number[]): number[] => {
  const tempArray = []
  const length = array.length
  for (let index = 0; index < length; index = index + 2) {
    tempArray.push(array[index] + array[index + 1] * 256)
  }
  return tempArray
}

export const push16 = (values: number[]): number[] => {
  const array = []
  for (let index = 0; index < values.length; index++) {
    array.push(0x00ff & values[index])
    array.push(values[index] >> 8)
  }
  return array
}
