import {Request, Response} from 'express';

class DataController {
  addData = async (req: Request, res: Response) => {
    res.status(200).end();
  };

  checkSecret = async (req: Request, res: Response) => {
    res.status(200).end();
  };
}

export default new DataController();
