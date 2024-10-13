import sha1 from 'sha1';
import jwt from 'jsonwebtoken';
import dbClient from '../utils/db.js';
import { blacklistToken } from './Blacklist.js';

const secretKey = process.env.SECRET_KEY || 'AUTH';

class AuthController {
  static async loginUser(request, response) {
    // const authHeader = request.header('Authorization');
    // let authData = authHeader.split(' ')[1];
    // const decData = Buffer.from(authData, 'base64');
    // authData = decData.toString('ascii');
    // const [uemail, password] = authData.split(':');
    const { userEmail, password } = request.body;
    console.log(userEmail, password);
    if (!userEmail || !password) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const hashedPassword = sha1(password);
    const users = await dbClient.db.collection('users');
    const user = await users.findOne({ email: userEmail, password: hashedPassword });

    console.log(!user);
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const token = jwt.sign(
      { id: user._id.toString() },
      secretKey,
      { expiresIn: '1min' },
    );

    return response.status(200).json({ token });
  }

  static async logoutUser(request, response) {
    const token = request.header('X-Token');
    console.log(token);
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

  /* static async authMiddleware(req, res, next) {
    // get token from header
    // if no token respond
    // if token expired, respond
    // decode token
    // add id to request
    // cal next
  } */
}

export default AuthController;
