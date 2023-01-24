import { findUserById } from "../../../utilities/findUser.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";

export const validateUser = async function (req, res, next) {
  const id = req.params.id;
  const user = await findUserById(id);

  if (!user) {
    return res.status(401).json({ message: "User does not exist." });
  }

  const token = req.headers.authorization;
  let readyToken = token;
  if (!token) {
    return res.status(401).json({ message: "No authorization header provided." });
  } else if (token.includes("Bearer")) {
    readyToken = token.slice(7);
  }

  let verified;
  if (readyToken != undefined) {
    verified = await verifyToken(readyToken);

    if (!verified) {
      return res.status(401).json({ message: "Invalid authorization token provided, please re-log." });
    }
  }

  //Throw 401 error if user isn't the correct user
  if (verified.role !== "admin") {
    if (verified.id != id) {
      return res.status(401).json({ message: "You do not have authorization to delete this user." });
    }
  }

  next();
};
