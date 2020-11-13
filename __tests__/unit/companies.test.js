const app = require("../../app");
const request = require("supertest");

describe("GET /companies", function () {
  test("Gets a list of companies", async function () {
    const response = await request(app).get(`/companies`);
    expect(response.body.companies).toHaveLength(1);
    expect(response.body.companies[0]).toHaveProperty("name");
    expect(response.body.companies[0]).toHaveProperty("handle");
  });
});
