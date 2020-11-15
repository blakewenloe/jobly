const db = require("../db");
const ExpressError = require("../helpers/expressError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = process.env.SECRET_KEY;
const salt = bcrypt.genSaltSync(10);
const JWT_OPTIONS = { expiresIn: 60 * 60 };

class User {
  // Get all users
  static async getUsers() {
    let results = await db.query(
      `SELECT username, first_name, last_name, email, photo_url
      FROM users`
    );
    return results.rows;
  }

  // Get user by username
  static async getUser(username) {
    const userResult = await db.query(
      `SELECT username, first_name, last_name, email, photo_url
      FROM users
      WHERE username = $1`,
      [username]
    );

    const jobResults = await db.query(
      `SELECT job_id, username, title, salary, equity, company_handle, state, created_at
      FROM applications AS "a"
      JOIN jobs AS "j"
      ON a.job_id=j.id
      WHERE username = $1`,
      [username]
    );

    const user = userResult.rows[0];

    if (!user) {
      throw new ExpressError(`${username} does not exist`, 404);
    }
    const jobs = jobResults.rows;
    user.jobs = jobs.map((job) => job);
    return user;
  }

  // Register user
  static async registerUser(data) {
    const { username, password, first_name, last_name, email, is_admin } = data;
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, is_admin)
               VALUES ($1, $2, $3, $4, $5, $6)
               RETURNING username, first_name, last_name, email, is_admin`,
      [username, hashedPassword, first_name, last_name, email, is_admin]
    );
    const registeredUser = result.rows[0];
    if (registeredUser) {
      let payload = { username, is_admin };
      let token = jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);
      return { token: token };
    }
  }

  // Login user
  static async login(data) {
    const { username, password } = data;
    const result = await db.query(
      `SELECT password, is_admin FROM users WHERE username = $1`,
      [username]
    );
    let user = result.rows[0];
    if (!user) {
      throw new ExpressError("Invalid user/password", 400);
    }
    if ((await bcrypt.compare(password, user.password)) === true) {
      let payload = { username: username, is_admin: user.is_admin };
      let token = jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);
      return token;
    }
  }

  // Update user
  static async updateUser(username, data) {
    let { first_name, last_name, email, photo_url } = data;
    const result = await db.query(
      `UPDATE users
      SET first_name=$1, last_name=$2, email=$3, photo_url=$4
      WHERE username = $5
      RETURNING *`,
      [first_name, last_name, email, photo_url, username]
    );
    const user = result.rows[0];
    if (!user) {
      throw new ExpressError(`${username} does not exist`, 404);
    }
    return user;
  }

  // Delete user
  static async deleteUser(username) {
    const result = await db.query(
      `DELETE FROM users
      WHERE username = $1`,
      [username]
    );

    return result.rows[0];
  }
}

module.exports = User;
