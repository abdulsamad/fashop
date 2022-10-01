import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '@models/user';
import { User as IUser } from '@types';

export const isLoggenIn = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ err: 'Please login to access this page' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById((decoded as any).id);

    // Append user object to request.user
    // Added types for req.user in /env.d.ts
    req.user = user as any;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ err: "You're unauthorized to access this page" });
  }
};

export const checkRole = (...roles: IUser['role'][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.user?.role;

      if (role && !roles.includes(role)) {
        return res.status(403).json({ err: "You're not allowed to access this resource" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(403).json({ err: "You're unauthorized to access this page" });
    }
  };
};
