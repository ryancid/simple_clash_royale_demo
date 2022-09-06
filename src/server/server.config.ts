import axios from "axios"
export const serverInstance = axios.create({baseURL: 'https://api.clashroyale.com/v1', 
  headers: {Authorization: 'Bearer '+ process.env.API_KEY}})