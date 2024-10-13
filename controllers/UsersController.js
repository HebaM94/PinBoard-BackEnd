import sha1 from 'sha1';
import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import dbClient from '../utils/db';
import { isTokenBlacklisted } from './Blacklist';

class UsersController {
  static async registerUser(request, response) {
    const { email, password } = request.body;
    if (!email) return response.status(400).send({ error: 'Missing email' });
    if (!password) return response.status(400).send({ error: 'Missing password' });
    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) {
      return response.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = sha1(password).toString();
    const newUser = await dbClient.db.collection('users').insertOne({
      email,
      password: hashedPassword,
    });

    return response.status(201).json({
      email,
      id: newUser.insertedId,
    });
  }

  static async getUser(request, response) {
    try {
      const token = request.header('X-Token');
      if (!token) {
        return response.status(401).json({ error: 'Unauthorized, missing token' });
      }

      if (isTokenBlacklisted(token)) {
        return response.status(401).json({ error: 'Unauthorized, token is expired' });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY || 'AUTH');
      const userId = decoded.id;
      if (!userId) {
        return response.status(401).json({ error: 'Unauthorized' });
      }
      const users = dbClient.db.collection('users');
      const idObj = new ObjectID(userId);
      const user = await users.findOne({ _id: idObj });
      if (!user) {
        return response.status(401).json({ error: 'Unauthorized' });
      }
      return response.status(200).json({ id: userId, email: user.email });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'Token expired' });
      }
      return response.status(401).json({ error: 'Unauthorized, token verification failed' });
    }
  }
}

export default UsersController;
