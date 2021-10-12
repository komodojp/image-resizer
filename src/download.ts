import axios from 'axios'
import stream from 'stream'

export function download(url: string) {
  if (process.env.NODE_ENV !== 'production') console.log(` > Download image ${url}`)
  return axios.get<stream.Writable>(url, {
    responseType: 'stream'
  })
}
