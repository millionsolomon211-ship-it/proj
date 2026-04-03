const pool = require('../config/db');

const createUser = async (fullName, username, email, phone, passwordHash) => {
  const query = `
    INSERT INTO users (full_name, username, email, phone, password_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, username, email;
  `;
  const values = [fullName, username, email, phone, passwordHash];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findUserByIdentifier = async (identifier) => {
  // Checks if the identifier matches username, email, OR phone
  const query = `
    SELECT * FROM users 
    WHERE username = $1 OR email = $1 OR phone = $1;
  `;
  const { rows } = await pool.query(query, [identifier]);
  return rows[0];
};

module.exports = {
  createUser,
  findUserByIdentifier,
};