import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

interface AuthenticationResponse {
  status: number;
  message?: string;
  isAuthenticated?: boolean;
}

interface CustomRequest extends Request {
  user: {
    id: string,
    username: string,
    email: string
  } | null
}

const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const customReq = req as CustomRequest;
  const token = req.headers['authorization'];
  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded) {
      customReq.user = {
        id: decoded!.id,
        username: decoded!.username,
        email: decoded!.email
      }
      next()
    } else {
      const response: AuthenticationResponse = {
        status: 403,
        message: 'Forbidden',
        isAuthenticated: false
      }
      res.json(response);
    }
  } else {
    const response: AuthenticationResponse = {
      status: 401,
      message: 'UnAuthorized',
      isAuthenticated: false,
    }
    res.json(response);
  }
}

const isNotAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization'];
  if (!token) {
    next()
  } else {
    const response: AuthenticationResponse = {
      status: 403,
      message: 'Already loggedin',
      isAuthenticated: true
    }
    res.json(response);
  }
}

export { isAuthenticated, isNotAuthenticated, CustomRequest };