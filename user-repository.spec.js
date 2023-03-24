const { MongoClient } = require("mongodb");
const UserRepository = require("./user-repository");
describe("UserRepository", () => {
  let repository;
  let collection;
  let client;

  beforeAll(async () => {
    const dsn =
      "mongodb://root:root@localhost:27017?retryWrites=true&writeConcern=majority";
    client = new MongoClient(dsn);
    await client.connect();
    collection = client.db("users_db").collection("users");
    repository = new UserRepository(collection);
  });

  afterAll(() => {
    client.close();
  });

  beforeEach(async () => {
    await collection.deleteMany({});
  });

  test("criar um novo usuario", async () => {
    const user = await repository.insert({
      name: "Pedro",
      email: "pedrinfreitas@gmail.com",
      senha: "123456",
    });

    const users = await collection.find({}).toArray();

    expect(users.length).toBe(1);
    expect(user).toStrictEqual(users[0]);
  });

  test("consultar um usuario por id", async () => {
    const dummy = await repository.insert({
      name: "Pedro Freitas",
    });

    const user = await repository.findById(dummy._id);

    expect(user).toStrictEqual(dummy);
  });

  test("atualizar um usuario", async () => {
    const user = await repository.insert({
      name: "Pedro Freitas",
    });

    await repository.update(user._id, {
      name: "Pedro Antonio",
    });

    const expectedUser = await repository.findById(user._id);
    expect(expectedUser.name).toBe("Pedro Antonio");
  });

  test("deletar um usuario", async () => {
    const user = await repository.insert({
      name: "Pedro Freitas",
    });

    await repository.delete(user._id);
    const result = await repository.findById(user._id);
    expect(result).toBe(null);
  });

  test("consultar todos os usuarios", async () => {
    await repository.insert({
      name: "Pedro Freitas",
    });

    await repository.insert({
      name: "Teste",
    });

    await repository.insert({
      name: "teste-real-oficial",
    });

    const result = await repository.findAll();

    expect(result.length).toBe(3);
  });
});
