const app = require("../../app");
const request = require("supertest");
const db = require("../../db");

describe("GET /companies", function () {
  test("Gets a list of companies", async function () {
    const response = await request(app).get(`/companies`);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /companies/:handle", function () {
  test("Gets a company by handle", async function () {
    await request(app).post(`/companies`).send({
      handle: "sonys",
      name: "Sonys",
      num_employees: 500,
      description: "Sony Entertainment",
      logo_url: "https://www.sony.net/top/2017/img/icon/top-og.jpg",
    });
    const response = await request(app).get(`/companies/sonys`);
    expect(response.statusCode).toBe(200);
    expect(response.body.company.description).toEqual("Sony Entertainment");
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

describe("DELETE /companies", async function () {
  test("Deletes a company", async () => {
    await request(app).delete(`/companies/sonys`);
    const deletedCompany = await request(app).get(`/companies/sonys`);
    expect(deletedCompany.statusCode).toBe(404);
  });
});
