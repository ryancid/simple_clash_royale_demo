import { NextApiRequest, NextApiResponse } from "next";
import { serverInstance } from "src/server/server.config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  //id : string | string[], may needed to check string[] case instead of just toString
  serverInstance
    .get("/players/" + encodeURIComponent(id.toString()))
    .then((axiosResult) =>
      res.status(axiosResult.status).json(axiosResult.data)
    )
    .catch((reason) => {
      res.status(404).json(reason);
    });
}
