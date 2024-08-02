

import jwt from 'jsonwebtoken';
import User from '../models/user.js'

export const auth  = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).send({ message: 'Access denied. No token provided.' });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).send({ message: 'User not found' });

      req.user = user;
      next();
  } catch (ex) {
      res.status(400).send({ message: 'Invalid token' });
  }
 
};
