const db = require("../db");
const ExpressError = require("../ExpressError");

class User {
  // Find all users
  static async getAll() {
    let results = db.query(
      `SELECT username, first_name, last_name, email, photo_url
      FROM users
      RETURNING username, first_name, last_name, email, photo_url`
    );
    return results.rows;
  }

  // Add user
  static async add(data) {
    let { username, password, first_name, last_name, email, photo_url } = data;
    const result = await db.query(
      `INSERT INTO users(username, password, first_name, last_name, email, photo_url)
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING username, first_name, last_name, email, photo_url`,
      [username, password, first_name, last_name, email, photo_url]
    );
    return result.rows;
  }

  // Get user by id
  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, email, photo_url
      FROM users
      WHERE username = $1`,
      [username]
    );
    return result.rows;
  }

  // Update user
  static async update(username, data) {
    let { first_name, last_name, email, photo_url } = data;
    const result = await db.query(
      `UPDATE users
      SET first_name=$1, last_name=$2, email=$3, photo_url=$4
      WHERE username = $5
      RETURNING *`,
      [first_name, last_name, email, photo_url, username]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`${username} does not exist`, 404);
    }
    return result.rows;
  }
  static async delete(username) {
    const result = await db.query(
      `
    DELETE FROM users
    WHERE username = $1
    `,
      [username]
    );

    return result.rows;
  }
}

module.exports = User;
