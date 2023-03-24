const app = require("./app");
const supertest = require("supertest");
const requestWithSupertest = supertest(app);

describe("API User", () => {
  let repository;
  const container = app.get("container");

  beforeAll(async () => {
    repository = await container.getUserRepository();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    const client = container.getClient();
    await client.close();
  });

  describe("POST", () => {
    test("Cadastrar um usuário", async () => {
      const user = {
        name: "Pedro",
        email: "pedrinfreitas@gmail.com",
        password: "123456",
      };

      const response = await requestWithSupertest
        .post("/users")
        .send(user)
        .expect("Content-Type", /application\/json/);

      expect(response.statusCode).toBe(201);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          name: "Pedro",
          email: "pedrinfreitas@gmail.com",
          password: "123456",
        })
      );
    });
  });

  describe("/users", () => {
    describe("GET", () => {
      test("listar todos os usuarios", async () => {
        await repository.insert({
          name: "Pedro",
          email: "pedrinfreitas@gmail.com",
          password: "1234563456",
        });

        const response = await requestWithSupertest
          .get("/users")
          .expect("Content-Type", /application\/json/);

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toStrictEqual(
          expect.objectContaining({
            name: "Pedro",
            email: "pedrinfreitas@gmail.com",
            password: "1234563456",
          })
        );
      });
    });
  });

  describe("GET", () => {
    test("Obter detalhes de um usuário existente", async () => {
      const user = await repository.insert({
        name: "Pedro",
        email: "pedrinfreitas@gmail.com",
        password: "1234563456",
      });

      const response = await requestWithSupertest
        .get(`/users/${user._id}`)
        .expect("Content-Type", /application\/json/);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          name: "Pedro",
          email: "pedrinfreitas@gmail.com",
          password: "1234563456",
        })
      );
    });

    test("Obter detalhes de um usuário não existente", async () => {
      const response = await requestWithSupertest
        .get(`/users/123UserNotFound`)
        .expect("Content-Type", /application\/json/);

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          error: "User not found",
          statusCode: 404,
        })
      );
    });
  });

  describe("PUT", () => {
    test("Alterar um usuário existete", async () => {
      const user = await repository.insert({
        name: "Pedro",
        email: "pedrinfreitas@gmail.com",
        password: "123456",
      });

      const response = await requestWithSupertest
        .put(`/users/${user._id}`)
        .send({
          name: "Pedro",
          email: "pedrinfreitas@gmail.com",
          password: "1234563456",
        })
        .expect("Content-Type", /application\/json/);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          name: "Pedro",
          email: "pedrinfreitas@gmail.com",
          password: "1234563456",
        })
      );
    });

    test("Alterar um usuário não existete", async () => {
      const response = await requestWithSupertest
        .put(`/users/123userNotFound`)
        .send({
          name: "Pedro",
          email: "pedrinfreitas@gmail.com",
          password: "1234563456",
        })
        .expect("Content-Type", /application\/json/);

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          error: "User not found",
          statusCode: 404,
        })
      );
    });
  });

  describe("DELETE", () => {
    test("remover um usuário existente", async () => {
      const user = await repository.insert({
        name: "Pedro",
        email: "pedrinfreitas@gmail.com",
        password: "1234563456",
      });

      const response = await requestWithSupertest.delete(`/users/${user._id}`);
      expect(response.statusCode).toBe(204);
    });
    test("remover um usuário não existete", async () => {
      const response = await requestWithSupertest
        .delete(`/users/123userNotFound`)
        .expect("Content-Type", /application\/json/);

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          error: "User not found",
          statusCode: 404,
        })
      );
    });
  });
});
