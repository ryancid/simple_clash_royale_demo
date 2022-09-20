import { AxiosError, AxiosResponse } from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { serverInstance } from 'src/server/server.config'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: ids } = req.query
  let id: string
  if (typeof ids === 'object' && Array.isArray(ids)) {
    id = ids[0]
    //take first id to query
  } else {
    id = ids
  }
  serverInstance
    .get('/players/' + encodeURIComponent(id))
    .then((axiosResult: AxiosResponse) =>
      res.status(axiosResult.status).json(axiosResult.data)
    )
    .catch((error: AxiosError) => {
      res.status(404).json(error)
    })
}
