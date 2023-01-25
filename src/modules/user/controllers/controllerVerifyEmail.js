import jsonwebtoken from "jsonwebtoken";
import * as dotenv from "dotenv";
import { findUserByEmail } from "../../../utilities/findUser.js";
import { databasePrisma } from "../../../prismaClient.js";
const { verify } = jsonwebtoken;
dotenv.config();

export const verifyEmail = async function (req, res) {
  const token = req.params.token;
  const data = verify(token, process.env.SECRETSAUCE);

  if (!data) {
    return res.status(400).send({ message: "Invalid token provided." });
  }

  if (!data.verify) {
    return res.status(400).send({ message: "Invalid token provided." });
  }

  const user = await findUserByEmail(data.email);

  if (!user) {
    return res.status(404).send({ message: "User does not exist." });
  }

  if (user.verified) {
    return res.status(400).send({ message: "User already verified." });
  }

  const { id } = user;

  const result = await databasePrisma.user.update({
    where: { id },
    data: { verified: true, updatedAt: new Date() },
  });

  console.log(result);
  return res.status(200).send({ message: "Your email has been verified. Thank you." });
};
