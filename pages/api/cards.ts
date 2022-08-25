import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { AxiosRequestHeaders, AxiosRequestConfig } from "axios";

const instance = axios.create({baseURL: 'https://api.clashroyale.com/v1', 
  headers: {Authorization: 'Bearer '+ process.env.API_KEY}})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method !== "GET") {
  //   res.status(404);
  // }
  // const headers:AxiosRequestHeaders = { 
  //   Authorization: "bearer " + token
  // };
  
  // const config:AxiosRequestConfig = 
  // {
  //   headers,
  // };
  // axios("https://api.clashroyale.com/v1/cards", config)
  instance.get('/cards')
  .then((axiosResult) =>
    res.status(axiosResult.status).json(axiosResult.data)
  );
}
