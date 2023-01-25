import { databasePrisma } from "../../../prismaClient.js";

export const handleDelete = async function (req) {
  const id = req.params.id;
  // Deletes the user
  try {
    await databasePrisma.user.delete({
      where: { id },
    });
    return Promise.resolve({ status: 200, data: { message: "Success" } });
  } catch (error) {
    if (error.status) {
      return Promise.resolve({
        status: error.status,
        data: { message: error.message },
      });
    } else {
      return Promise.resolve({
        status: 500,
        data: { message: "Internal server error.", ...error },
      });
    }
  }
};
