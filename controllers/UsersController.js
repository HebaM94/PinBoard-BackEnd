import sha1 from 'sha1';
import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import dbClient from '../utils/db';
import { isTokenBlacklisted } from '../utils/Blacklist';

const secretKey = process.env.SECRET_KEY || 'AUTH';

class UsersController {
  static async registerUser(request, response) {
    const { username, email, password } = request.body;
    if (!username) return response.status(400).send({ error: 'Missing username' });
    if (!email) return response.status(400).send({ error: 'Missing email' });
    if (!password) return response.status(400).send({ error: 'Missing password' });
    const usernameUsed = await dbClient.db.collection('users').findOne({ username });
    if (usernameUsed) {
      return response.status(400).json({ error: 'Username is taken' });
    }
    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) {
      return response.status(400).json({ error: 'Already exist' });
    }

    try {
      const token = jwt.sign({ email }, secretKey, { expiresIn: '30min' });
      const activationLink = `http://localhost:5000/activation/${token}`; // update localhost:5000 to the actual domain
      const mailOptions = {
        from: '"Pinboard Support" <no-reply@pinboard.com>',
        to: email,
        subject: 'Account activation',
        html: `<p>Hello,</p>
               <p>To activate your account click on the link below (Note: valid for 30 minutes): <br> <a href="${activationLink}">${activationLink}</a></p>
               <p>Best regards,</p>`,
      };

      await sendEmail(mailOptions);

      const hashedPassword = sha1(password).toString();
      const newUser = await dbClient.db.collection('users').insertOne({
        username,
        email,
        password: hashedPassword,
      });

      return response.status(201).json({
        username,
        email,
        id: newUser.insertedId,
      });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'Token has expired, please register again' });
      }
      return response.status(500).json({ error: 'Error creating user' });
    }
  }

  static async getUser(request, response) {
    try {
      const token = request.header('token');
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
