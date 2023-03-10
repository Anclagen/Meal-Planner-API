import { signToken } from "../../../utilities/jsonWebToken.js";
import { generateHash } from "../../../utilities/password.js";
import { databasePrisma } from "../../../prismaClient.js";
import { mediaGuard } from "../../../utilities/mediaGuard.js";

export const handleRegister = async function (req) {
  const { name, email, password, role, avatar } = req.body;
  // Check if user exists
  const existingUser = await databasePrisma.user.count({ where: { email } });
  if (existingUser > 0) {
    return Promise.resolve({ status: 409, message: "User already exists" });
  }
  const hash = await generateHash(password);
  // create object
  let data = {
    name,
    email,
    password: hash,
  };

  //data.role = role

  // if avatar
  if (avatar) {
    try {
      data.avatar = await mediaGuard(avatar);
    } catch (err) {
      console.log(err);
      return Promise.resolve({ status: 400, message: "Bad image URL" });
    }
  }

  const result = await databasePrisma.user.create({
    data,
  });
  const { id } = result;
  result["token"] = signToken({ id, email });
  ["password", "about", "banner", "updatedAt"].forEach((field) => delete result[field]);
  return result;
};
