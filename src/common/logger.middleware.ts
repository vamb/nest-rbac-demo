import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request... query body method', req.query, req.body, req.method, req.originalUrl,
      // req.headers
      // req.rawHeaders
    )
    next();
  }
}
