const UserRepository = require("./user-repository");
const { MongoClient } = require("mongodb");

class AppContainer {
  services = {};

  getClient() {
    if (this.services.client) {
      return this.services.client;
    }

    const dsn =
      "mongodb://root:root@localhost:27017?retryWrites=true&writeConcern=majority";

    return (this.services.client = new MongoClient(dsn));
  }

  async getUserRepository() {
    if (this.services.userRepository) {
      return this.services.userRepository;
    }

    const client = this.getClient();
    await client.connect();

    const collection = client.db("app_db").collection("users");
    return (this.services.userRepository = new UserRepository(collection));
  }
}

module.exports = AppContainer;
