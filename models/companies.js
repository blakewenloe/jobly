const db = require("../db");

class Company {
  static async getAll() {
    const companies = await db.query(`SELECT * FROM companies`);
    return companies.rows;
  }
}

module.exports = Company;
