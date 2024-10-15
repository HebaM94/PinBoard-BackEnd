import sha1 from 'sha1';
import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
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
      return response.status(204).json({ message: 'User logged out successfully' });
    } catch (error) {
      return response.status(401).json({ error: 'Unauthorized, invalid token' });
    }
  }

  static async forgotPassword(request, response) {
    const { email } = request.body;
    if (!email) {
      return response.status(400).json({ error: 'Missing email' });
    }



    try {
      const user = await dbClient.db.collection('users').findOne({ email });
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    const temporaryPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = sha1(temporaryPassword);
    await dbClient.db.collection('users').updateOne(
      { _id: ObjectID(user._id) },
      { $set: { password: hashedPassword } }
    );

    await sendEmail(email, temporaryPassword); // function need to be implemented using front-end or back-end by nodemailer

    return response.status(200).send();
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create a temporary password' });
    }

  }

  static async resetPassword(request, response){
    const { email, password, newPassword } = request.body;
    if (!email || !password || !newPassword) {
      return response.status(400).json({ error: 'Missing email or password (old & new)' });
    }

    try{
      const hashedPassword = sha1(password);
      const hashedNewPassword = sha1(newPassword);
      const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });
  
      if (!user) {
        return response.status(401).json({ error: 'Unauthorized access' });
      }
  
      await dbClient.db.collection('users').updateOne(
        { _id: ObjectID(user._id) },
        { $set: { password: hashedNewPassword } }
      );
  
      return response.status(200).json({ message: 'Password reseted successfully' });
    } catch (err) {
      return response.status(500).json({ error: 'Failed to reset password' });
    }
  }

  static async authMiddleware(request, response, next) {
    const token = request.header('token');
    if (!token) {
      return response.status(401).json({ error: 'Unauthorized, missing token header' });
    }

    try {
      const decode = await jwt.verify(token, secretKey);

      if (isTokenBlacklisted(token)) {
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
