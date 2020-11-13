const app = require("../../app");
const request = require("supertest");
const db = require("../../db");
process.env.NODE_ENV = "test";

describe("GET /companies", function () {
  test("Gets a list of companies", async function () {
    const response = await request(app).get(`/companies`);
    expect(response.body.companies).toHaveLength(1);
    expect(response.body.companies[0]).toHaveProperty("name");
    expect(response.body.companies[0]).toHaveProperty("handle");
  });
});

describe("POST /companies", async function () {
  beforeEach(async function () {
    await db.query("DELETE FROM companies");
  });
  test("Creates a new company", async () => {
    const response = await request(app).post(`/companies`).send({
      handle: "sonys",
      name: "Sonys",
      num_employees: 500,
      description: "Sony Entertainment",
      logo_url: "https://www.sony.net/top/2017/img/icon/top-og.jpg",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.company[0]).toHaveProperty("handle", "sonys");
    expect(response.body.company[0]).toHaveProperty("num_employees", 500);
  });
});

describe("PATCH /companies", async function () {
  test("Updates a company", async () => {
    const response = await request(app).patch(`/companies/sonys`).send({
      handle: "sonys",
      name: "Sonys",
      num_employees: 122,
      description: "Sony",
      logo_url: "https://www.sony.net/top/2017/img/icon/top-og.jpg",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.company[0]).toHaveProperty("description", "Sony");
    expect(response.body.company[0]).toHaveProperty("num_employees", 122);
  });
});
