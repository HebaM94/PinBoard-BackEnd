import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const HOST = process.env.DB_HOST || 'localhost';
    const PORT = process.env.DB_PORT || 27017;
    const DATABASE = process.env.DB_DATABASE || 'pinboard';
    const url = `mongodb://${HOST}:${PORT}/${DATABASE}`;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      this.db = this.client.db(DATABASE);
    }).catch((err) => {
      console.log(err);
    });
  }

  isAlive() {
    return this.client.topology.isConnected();
  }

  async nbUsers() {
    const collection = this.db.collection('users');
    const usersNum = await collection.countDocuments();
    return usersNum;
  }

  async nbNotes() {
    const collection = this.db.collection('notes');
    const notessNum = await collection.countDocuments();
    return notessNum;
  }
}

const dbClient = new DBClient();
export default dbClient;
