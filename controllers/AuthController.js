import sha1 from 'sha1';
import jwt from 'jsonwebtoken';
import dbClient from '../utils/db';
import { blacklistToken, isTokenBlacklisted } from './Blacklist';

const secretKey = process.env.SECRET_KEY || 'AUTH';

class AuthController {
  static async loginUser(request, response) {
    const { userEmail, password } = request.body;
    console.log(userEmail, password);
    if (!userEmail || !password) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const hashedPassword = sha1(password);
    const users = await dbClient.db.collection('users');
    const user = await users.findOne({ email: userEmail, password: hashedPassword });

    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      secretKey,
      { expiresIn: '15min' },
    );

    return response.status(200).json({ token });
  }

  static async logoutUser(request, response) {
    const token = request.header('token');
    if (!token) {
      return response.status(401).json({ error: 'Unauthorized, missing token header' });
    }

    try {
      jwt.verify(token, secretKey);
      blacklistToken(token);
      return response.status(204).send();
    } catch (error) {
      return response.status(401).json({ error: 'Unauthorized, invalid token' });
    }
  }

  static async authMiddleware(request, response, next) {
    const token = request.header('token');
    if (!token) {
      return response.status(401).json({ error: 'Unauthorized, missing token header' });
    }
    
    try {
    const decode = await jwt.verify(token, secretKey);
    
    if (isTokenBlacklisted(token) ) {
      return response.status(401).json({ error: 'Unauthorized, invalid token' });
    }

    if (!decode) {
      return response.status(401).json({ error: 'Unauthorized, invalid token' });
    }
    
    request.userId = decode.id;
    next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'Token has expired' });
      }
      return response.status(401).json({ error: 'Invalid token' });
    }
  }
}

export default AuthController;
