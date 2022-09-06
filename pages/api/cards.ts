import { NextApiRequest, NextApiResponse } from "next";
import { serverInstance } from "src/server/server.config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  serverInstance.get('/cards')
  .then((axiosResult) =>
    res.status(axiosResult.status).json(axiosResult.data)
  );
}
