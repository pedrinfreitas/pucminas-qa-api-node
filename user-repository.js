const mongo = require("mongodb");

class UserRepository {
  constructor(collection) {
    this.collection = collection;
  }
  async insert(user) {
    await this.collection.insertOne(user);
    return user;
  }

  async findAll() {
    const result = await this.collection.find({});
    return result.toArray();
  }

  async clear() {
    return await this.collection.deleteMany({});
  }

  async findById(id) {
    return await this.collection.findOne({
      _id: new mongo.ObjectId(id),
    });
  }

  async update(id, user) {
    const result = await this.collection.findOneAndUpdate(
      {
        _id: new mongo.ObjectId(id),
      },
      {
        $set: user,
      }
    );

    return await this.findById(id);
  }

  async delete(id) {
    const result = await this.collection.deleteOne({
      _id: new mongo.ObjectId(id),
    });

    return result.deletedCount;
  }
}

module.exports = UserRepository;
