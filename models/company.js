const db = require("../db");
const ExpressError = require("../helpers/ExpressError");

class Company {
  // Find all companies (can filter on terms in data).
  static async getAll(data) {
    let baseQuery = `SELECT handle, name FROM companies`;
    let whereExpressions = [];
    let queryValues = [];

    if (+data.min_employees >= +data.max_employees) {
      throw new ExpressError(
        "Min employees must be less than max employees",
        400
      );
    }

    // For each possible search term, add to whereExpressions and
    // queryValues so we can generate the right SQL
    if (data.min_employees) {
      queryValues.push(+data.min_employees);
      whereExpressions.push(`num_employees >= $${queryValues.length}`);
    }
    if (data.max_employees) {
      queryValues.push(+data.max_employees);
      whereExpressions.push(`num_employees <= $${queryValues.length}`);
    }
    if (data.search) {
      queryValues.push(`%${data.search}%`);
      whereExpressions.push(`name ILIKE $${queryValues.length}`);
    }
    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }

    // Finalize query and return results
    let finalQuery =
      baseQuery + whereExpressions.join(" AND ") + " ORDER BY name";
    const companiesRes = await db.query(finalQuery, queryValues);
    return companiesRes.rows;
  }

  // Add company
  static async add(data) {
    let { handle, name, num_employees, description, logo_url } = data;
    const result = await db.query(
      `INSERT INTO companies(handle, name, num_employees, description, logo_url)
      VALUES($1,$2,$3,$4,$5)
      RETURNING handle, name, num_employees, description, logo_url`,
      [handle, name, num_employees, description, logo_url]
    );
    return result.rows;
  }

  // Get company by handle
  static async get(handle) {
    const companyResult = await db.query(
      `SELECT handle, name, num_employees, description, logo_url
      FROM companies
      WHERE handle = $1`,
      [handle]
    );
    const jobsResults = await db.query(
      `
    SELECT title, salary, equity
    FROM jobs
    WHERE company_handle = $1`,
      [handle]
    );
    if (companyResult.rows.length === 0) {
      throw new ExpressError(`No company found for ${handle}`, 404);
    }
    const company = companyResult.rows[0];
    const jobs = jobsResults.rows;
    company.jobs = jobs.map((job) => job);
    return company;
  }

  // Update company
  static async update(handle, data) {
    let { name, num_employees, description, logo_url } = data;
    const result = await db.query(
      `UPDATE companies
      SET name=$1, num_employees=$2, description=$3, logo_url=$4
      WHERE handle = $5
      RETURNING handle, name, num_employees, description, logo_url`,
      [name, num_employees, description, logo_url, handle]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`${handle} does not exist`, 404);
    }
    return result.rows;
  }
  static async delete(handle) {
    const result = await db.query(
      `DELETE FROM companies
      WHERE handle = $1`,
      [handle]
    );

    return result.rows;
  }
}

module.exports = Company;
