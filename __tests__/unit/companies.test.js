const app = require("../../app");
const request = require("supertest");
const db = require("../../db");

describe("DELETE /companies", async function () {
  test("Deletes a company", async () => {
    await request(app).delete(`/companies/sonys`);
    let checkIfCompanyExists = await request(app).get(`/companies/gamestop`);
    expect(checkIfCompanyExists.statusCode).toBe(404);
  });
});

describe("POST /companies", async function () {
  beforeEach(async () => {
    await db.query(`DELETE FROM companies WHERE handle='IP'`);
  });
  test("Creates a new company", async () => {
    const response = await request(app).post(`/companies`).send({
      handle: "IP",
      name: "IP",
      num_employees: 5,
      description: "GameStop and Fun",
      logo_url: "top-og.jpg",
    });

    expect(response.body.company[0].name).toEqual("IP");
  });
});

describe("GET /companies", async function () {
  test("Gets a list of companies", async () => {
    const response = await request(app).get(`/companies`);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /companies/:handle", async function () {
  test("Gets a company by handle", async () => {
    const response = await request(app).get(`/companies/sonys`);
    expect(response.statusCode).toBe(200);
    expect(response.body.company.description).toEqual("Games and Fun");
  });
});

describe("PATCH /companies", async function () {
  test("Updates a company", async () => {
    const response = await request(app).patch(`/companies/sonys`).send({
      handle: "sonys",
      name: "GameStop",
      num_employees: 545,
      description: "Games and Fun",
      logo_url: "top-of.jpg",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.company[0]).toHaveProperty(
      "description",
      "Games and Fun"
    );
    expect(response.body.company[0]).toHaveProperty("num_employees", 545);
  });
});
