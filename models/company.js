const db = require("../db");

class Company {
  /** Find all companies (can filter on terms in data). */
  static async getAll() {
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
}

module.exports = Company;
