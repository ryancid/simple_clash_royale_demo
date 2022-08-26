import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const instance = axios.create({baseURL: 'https://api.clashroyale.com/v1', 
  headers: {Authorization: 'Bearer '+ process.env.API_KEY}})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  instance.get('/cards')
  .then((axiosResult) =>
    res.status(axiosResult.status).json(axiosResult.data)
  );
}
