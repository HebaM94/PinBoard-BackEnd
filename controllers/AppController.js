import dbClient from '../utils/db.js';

class AppController {
  static getStatus(_request, response) {
    const dbStatus = dbClient.isAlive();
    return response.status(200).json({ db: dbStatus });
  }

  static async getStats(_request, response) {
    const usersNum = await dbClient.nbUsers();
    const notesNum = await dbClient.nbNotes();
    return response.status(200).json({ users: usersNum, notes: notesNum });
  }
}

export default AppController;
