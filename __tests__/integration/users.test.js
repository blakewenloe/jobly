const app = require("../../app");
const request = require("supertest");

describe("DELETE /user", async function () {
  test("Deletes a user", async () => {
    await request(app).delete(`/users/aarswesag`);
    let checkIfUserExists = await request(app).get(`/users/aarswesag`);
    expect(checkIfUserExists.statusCode).toBe(404);
  });
});

describe("POST /users", async function () {
  test("Creates a new user", async () => {
    const response = await request(app).post(`/users`).send({
      username: "aarswesag",
      first_name: "aarswesag",
      password: "F$@$#FWERF#$%RW",
      last_name: "slicer",
      email: "ssqqqs@gmail.com",
      photo_url: "https://jsonschema.net/assets/svg/logo_blue.svg",
    });

    expect(response.body.user[0].username).toEqual("aarswesag");
  });
});

describe("GET /users", async function () {
  test("Gets a list of users", async () => {
    const response = await request(app).get(`/users`);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /users/:username", async function () {
  test("Gets a user by username", async () => {
    const response = await request(app).get(`/users/aarswesag`);
    expect(response.statusCode).toBe(200);
    expect(response.body.user[0].last_name).toEqual("slicer");
  });
});

describe("PATCH /users", async function () {
  test("Updates a user", async () => {
    const response = await request(app).patch(`/users/aarswesag`).send({
      username: "aarswesag",
      first_name: "newbie",
      password: "F$@$#FWERF#$%RW",
      last_name: "glue",
      email: "newbiewglue@gmail.com",
      photo_url: "https://jsonschema.net/assets/svg/logo_blue.svg",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.user[0].email).toEqual("newbiewglue@gmail.com");
    expect(response.body.user[0].first_name).toEqual("newbie");
  });
});
