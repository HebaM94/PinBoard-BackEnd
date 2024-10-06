import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  static getStatus(_request, response) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();
    return response.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  static async getStats(_request, response) {
    const usersNum = await dbClient.nbUsers();
    const notesNum = await dbClient.nbNotes();
    return response.status(200).json({ users: usersNum, notes: notesNum });
  }
}

export default AppController;
