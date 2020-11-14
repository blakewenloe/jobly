const db = require("../db");
const ExpressError = require("../helpers/ExpressError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = process.env.SECRET_KEY;
const salt = bcrypt.genSaltSync(10);
const JWT_OPTIONS = { expiresIn: 60 * 60 };

class User {
  // Get all users
  static async getAll() {
    let results = await db.query(
      `SELECT username, first_name, last_name, email, photo_url
      FROM users`
    );
    return results.rows;
  }

  // Get user by username
  static async getUser(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, email, photo_url
        FROM users
        WHERE username = $1`,
      [username]
    );

    return result.rows;
  }

  // Register user
  static async register(data) {
    const { username, password, first_name, last_name, email, is_admin } = data;
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, is_admin)
               VALUES ($1, $2, $3, $4, $5, $6)
               RETURNING username, first_name, last_name, email, is_admin`,
      [username, hashedPassword, first_name, last_name, email, is_admin]
    );
    let payload = { username, is_admin };
    let token = jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);
    return { token: token };
  }

  // Login user
  static async login(data) {
    const { username, password } = data;
    const result = await db.query(
      `SELECT password, is_admin FROM users WHERE username = $1`,
      [username]
    );
    let user = result.rows[0];
    if (user) {
      if ((await bcrypt.compare(password, user.password)) === true) {
        let payload = { username: username, is_admin: user.is_admin };
        let token = jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);
        return token;
      }
    }
    throw new ExpressError("Invalid user/password", 400);
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

  // Delete user
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
