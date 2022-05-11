/* eslint-disable */
import {NextFunction, Request, Response} from 'express';

export function cors(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');

  res.setHeader('Access-Control-Allow-Credentials', 'true');   

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, REPORT, AUTHORIZATION');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', `Authorize, X-Requested-With, content-type, Authorization, Accept, enctype`);

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, REPORT, OPTIONS, AUTHORIZATION');
    return res.status(200).json({});
  }
  next();
}
