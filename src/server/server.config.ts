import axios from 'axios'

const APIURL = 'https://api.clashroyale.com/v1'
const ProxyURL = 'https://proxy.royaleapi.dev/v1'

export const serverInstance = axios.create({
  baseURL: ProxyURL,
  headers: { Authorization: 'Bearer ' + process.env.API_KEY },
})
