const app = require("../../app");
const request = require("supertest");

require("dotenv").config();

describe("GET /jobs", () => {
  test("Gets list of jobs", async () => {
    const response = await request(app).get(`/jobs`);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /jobs/:id", async () => {
  test("Gets a job by id", async () => {
    const response = await request(app).get(`/jobs/14`);
    expect(response.statusCode).toBe(200);
    expect(response.body.job[0].equity).toEqual(0.5);
  });
});

describe("POST /jobs", async () => {
  test("Creates a new job", async () => {
    const response = await request(app).post(`/jobs`).send({
      title: "dev",
      salary: 4323,
      equity: 0.5,
      company_handle: "sonys",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.job[0]).toHaveProperty("title", "dev");
    expect(response.body.job[0]).toHaveProperty("equity", 0.5);
  });
});

describe("PATCH /jobs", async () => {
  test("Updates a job", async () => {
    const response = await request(app).patch(`/jobs/14`).send({
      title: "dev",
      salary: 4323,
      equity: 0.5,
      company_handle: "sonys",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.job[0]).toHaveProperty("title", "dev");
    expect(response.body.job[0]).toHaveProperty("salary", 4323);
  });
});

describe("DELETE /jobs", async () => {
  test("Deletes a job", async () => {
    await request(app).delete(`/jobs/12`);
    const deletedJob = await request(app).get(`/jobs/12`);
    expect(deletedJob.statusCode).toBe(404);
  });
});
