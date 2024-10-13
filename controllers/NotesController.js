import mongodb from 'mongodb';
const { ObjectID } = mongodb;
import dbClient from '../utils/db.js';

class NotesController {
  static async createNote(request, response) {
    const { title, content } = request.body;

    const newNote = {
      title: title || 'Untitled',
      content: content || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result = await dbClient.db.collection('notes').insertOne(newNote);
      return response.status(201).json({ message: 'Note created successfully', noteId: result.insertedId });
    } catch (error) {
      return response.status(500).json({ error: 'Could not create note' });
    }
  }

  static async readNote(request, response) {
    const { id } = request.params;
    if (!ObjectID.isValid(id)) {
      return response.status(400).json({ error: 'Invalid note ID' });
    }

    try {
      const note = await dbClient.db.collection('notes').findOne({ _id: ObjectID(id) });

      if (!note) {
        return response.status(404).json({ error: 'Note not found' });
      }

      return response.status(200).json(note);
    } catch (error) {
      return response.status(500).json({ error: 'Could not retrieve note' });
    }
  }

  /* static async updateNote(request, response) {
    const { id } = request.params;
    const { title, content } = request.body;

    if (!ObjectID.isValid(id)) {
      return response.status(400).json({ error: 'Invalid note ID' });
    }

    if (!title && !content) {
      return response.status(400).json({ error: 'Title or content must be provided to update' });
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (content) updatedData.content = content;
    updatedData.updatedAt = new Date();

    try {
      const result = await dbClient.db.collection('notes').updateOne(
        { _id: ObjectID(id) },
        { $set: updatedData },
      );

      if (result.matchedCount === 0) {
        return response.status(404).json({ error: 'Note not found' });
      }

      response.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
      response.status(500).json({ error: 'Could not update note' });
    }
    return null;
  }

  static async deleteNote(request, response) {
    const { id } = request.params;

    if (!ObjectID.isValid(id)) {
      return response.status(400).json({ error: 'Invalid note ID' });
    }

    try {
      const result = await dbClient.db.collection('notes').deleteOne({ _id: ObjectID(id) });

      if (result.deletedCount === 0) {
        return response.status(404).json({ error: 'Note not found' });
      }

      response.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      response.status(500).json({ error: 'Could not delete note' });
    }
    return null;
  } */
}

export default NotesController;
