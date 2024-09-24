const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const ApiError = require("../utils/apiError");
const { Op } = require("sequelize");

const register = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const isUserExist = await Users.findOne({ where: { email } });
    if (isUserExist) {
      return next(new ApiError("Email already registered", 400));
    }

    if (password.length < 8) {
      return next(new ApiError("Password must be at least 8 characters", 400));
    }

    if (password !== confirmPassword) {
      return next(new ApiError("Passwords do not match", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({ email, password: hashedPassword });

    res.status(201).json({
      status: "Success",
      message: "User registered successfully",
      data: { id: newUser.id, email: newUser.email },
    });
  } catch (err) {
    return next(new ApiError(err, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError("Email and password are required", 400));
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return next(new ApiError("Invalid email or password", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ApiError("Invalid email or password", 400));
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED,
    });

    res.status(200).json({
      status: "Success",
      message: "Login successful",
      data: { token },
    });
  } catch (err) {
    return next(new ApiError(err, 500));
  }
};

module.exports = {
  register,
  login,
};
