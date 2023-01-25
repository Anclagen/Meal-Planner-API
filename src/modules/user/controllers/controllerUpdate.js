import { generateHash, verifyPassword } from "../../../utilities/password.js";
import { findUserById } from "../../../utilities/findUser.js";
import { verifyToken } from "../../../utilities/jsonWebToken.js";
import { databasePrisma } from "../../../prismaClient.js";
import { mediaGuard } from "../../../utilities/mediaGuard.js";

/**
 * validates request body, signs jwt token and returns response object
 * @param {Object} req API Request
 */
export const handleUpdate = async function (req) {
  // Find the user to be updated
  const id = req.params.id;
  const { email, name, password, about, avatar, banner, currentpassword, role } = req.body;

  let details = {};
  //if user is a applicant or client don't allow an update of role
  if (user.role === "Admin") {
    details.role = role;
  } else if (role != undefined) {
    return Promise.resolve({
      status: 404,
      data: { message: "You don't have permission to edit roles." },
    });
  }

  if (name !== undefined) {
    details.name = name;
  }

  if (about !== undefined) {
    details.about = about;
  }

  // Handles password changes
  if (password !== undefined && currentpassword !== undefined) {
    if (password.length >= 5 && password.length <= 20) {
      if (await verifyPassword(user, currentpassword)) {
        const hash = await generateHash(password);
        details.password = hash;
      } else {
        return Promise.resolve({
          status: 401,
          data: { message: "Incorrect Password" },
        });
      }
    } else {
      return Promise.resolve({
        status: 401,
        message: "Password does not meet required parameters length: min 5, max 20",
      });
    }
  } else if (password !== undefined && currentpassword === undefined) {
    return Promise.resolve({
      status: 401,
      data: { message: "No current password provided" },
    });
  }

  //Email update request meets email parameters
  const emailReg = /^\S+@\S+\.\S+$/;
  if (email !== undefined && !emailReg.test(email)) {
    return Promise.resolve({
      status: 403,
      data: {
        message: "Email provided does not meet email format requirements",
      },
    });
  } else if (email !== undefined) {
    details.email = email;
  }

  if (avatar !== undefined) {
    try {
      await mediaGuard(avatar);
      details.avatar = avatar;
    } catch (err) {
      console.log(err);
      return Promise.resolve({
        status: 400,
        data: { message: "Bad image URL" },
      });
    }
  }

  if (banner !== undefined) {
    try {
      await mediaGuard(banner);
      details.banner = banner;
    } catch (err) {
      console.log(err);
      return Promise.resolve({
        status: 400,
        data: { message: "Bad image URL" },
      });
    }
  }

  // Updates the user
  try {
    const result = await databasePrisma.user.update({
      where: { id },
      data: details,
    });

    result.response = "User details updated successfully.";
    delete result.password;

    return { status: 200, data: result };
  } catch (error) {
    if (!error.status) {
      // Checks for database related errors
      if (error.meta != undefined) {
        return Promise.resolve({
          status: 409,
          data: {
            message: `The unique input ${error.meta.target[0]} already exists for another user`,
          },
        });
      } else {
        return Promise.resolve({
          status: 400,
          data: {
            message: `An argument or input value does not exist or cannot be edited in the database ${error.message}`,
          },
        });
      }
    } else {
      if (error.status) {
        return Promise.resolve({
          status: error.status,
          data: { message: error.message },
        });
      }
    }
  }
};
