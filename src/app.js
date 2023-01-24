import express from "express";
import { usersRouter } from "./modules/user/routes.js";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// options for swagger jsdocs
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Meal Planner App",
      version: "0.0.1",
      description: "An Express and Prisma rest API to server a recipe and meal planner",
      license: {
        name: "Licensed Under MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "Authorization",
          scheme: "bearer",
          in: "header",
        },
      },
    },
  },
  apis: ["./src/modules/**/*.js"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(
  bodyParser.json({
    extended: false,
  })
);

//stops html response on unexpected json token
const jsonErrorHandler = function (error, req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.status(error.status).send(JSON.stringify({ ...error, message: "Bad request, json parse failed." }));
};

app.use(jsonErrorHandler);

app.use("/users", usersRouter);

const server = app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`));

export default server;
