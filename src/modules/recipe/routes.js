import express from "express";
import { databasePrisma } from "../../prismaClient.js";
import validator from "express-validator";
const { body, validationResult } = validator;
import { validateUser } from "./middleware/validateUser.js";

export const recipeRouter = express.Router();

// POST create a recipe
