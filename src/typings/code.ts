type Code = {
  code: number
  responseHandler?: (response: Array<number>) => any
  requestHandler?: (payload: any) => Array<number>
}

export default Code
