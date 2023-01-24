import jsonwebtoken from "jsonwebtoken";
import * as dotenv from "dotenv";
const { sign, verify } = jsonwebtoken;
import { findUserById } from "./findUser.js";
dotenv.config();

/**
 * Takes a token and verifies it, as well as verify user still exists returns false or user data
 * @param {String} token
 * @returns {promise<Boolean||Object>}
 */
export async function verifyToken(token) {
  try {
    const data = verify(token, process.env.SECRETSAUCE);
    if (data) {
      const user = await findUserById(data.userId);
      if (user) {
        return Promise.resolve(user);
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Creates an access token
 * @param {Object} profile needs userId and email
 * @returns {String} access token
 */
export function signToken({ id, email }) {
  const token = sign({ userId: id, email: email }, process.env.SECRETSAUCE, {
    expiresIn: "24h",
  });
  return token;
}
