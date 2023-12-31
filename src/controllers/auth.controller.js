import bcrypt from "bcrypt";
import db from "../models/index.js";
import { createError } from "../utils/error.js";

import jwt from "jsonwebtoken";

//signup
export const signup = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    /**creating Hash */
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password.toString(), salt);

    /**creating new user */
    const newUser = { username, password: hash, email, role: "user" };

    /**saving user to database */
    await db.user.create(newUser);

    /**send back status code and json */
    res.status(200).json({ message: "User has been added" });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await db.user.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong Credentials"));

    const token = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN);

    const { password, ...others } = user.dataValues;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        // secure: true,
        secure: false,
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};

export const signout = async (req, res, next) => {
  // const token = jwt.sign({ id: req.user.id }, process.env.JWT);
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "signout successfull" });
};
