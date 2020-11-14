const db = require("../db");
const ExpressError = require("../helpers/ExpressError");

class Job {
  // Find all jobs (can filter on terms in data)
  static async getAll(data) {
    let baseQuery = `SELECT id, title, salary, equity, company_handle FROM jobs`;
    let whereExpressions = [];
    let queryValues = [];

    // For each possible search term, add to whereExpressions and
    // queryValues so we can generate the right SQL

    if (data.min_salary) {
      queryValues.push(+data.min_employees);
      whereExpressions.push(`min_salary >= $${queryValues.length}`);
    }

    if (data.max_equity) {
      queryValues.push(+data.max_employees);
      whereExpressions.push(`min_equity >= $${queryValues.length}`);
    }

    if (data.search) {
      queryValues.push(`%${data.search}%`);
      whereExpressions.push(`title ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }

    // Finalize query and return results
    let finalQuery = baseQuery + whereExpressions.join(" AND ");
    const jobsRes = await db.query(finalQuery, queryValues);
    return jobsRes.rows;
  }

  // Add job
  static async add(data) {
    let { title, salary, equity, company_handle } = data;
    const result = await db.query(
      `INSERT INTO jobs(title, salary, equity, company_handle)
      VALUES($1,$2,$3,$4)
      RETURNING id, title, salary, equity, company_handle`,
      [title, salary, equity, company_handle]
    );
    return result.rows;
  }

  // Get job by id
  static async get(id) {
    const result = await db.query(
      `SELECT *
      FROM jobs
      WHERE id = $1`,
      [id]
    );
    return result.rows;
  }

  // Update job
  static async update(id, data) {
    let { title, salary, equity, company_handle } = data;
    const result = await db.query(
      `UPDATE jobs
      SET title=$1, salary=$2, equity=$3, company_handle=$4
      WHERE id = $5
      RETURNING *`,
      [title, salary, equity, company_handle, id]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`${id} does not exist`, 404);
    }
    return result.rows;
  }
  static async delete(id) {
    const result = await db.query(
      `
    DELETE FROM jobs
    WHERE id = $1
    `,
      [id]
    );

    return result.rows;
  }
}

module.exports = Job;
