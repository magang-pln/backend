const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const ApiError = require("../utils/apiError");
const { Op } = require("sequelize");

const register = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const isUserExist = await User.findOne({ where: { email } });
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

    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      status: "Success",
      message: "User registered successfully",
      data: { id: newUser.id, email: newUser.email },
    });
  } catch (err) {
    return next(new ApiError("Failed to register user", 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError("Email and password are required", 400));
    }

    const user = await User.findOne({ where: { email } });
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
    return next(new ApiError("Failed to log in", 500));
  }
};

// const resetPasswordRequest = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return next(new ApiError("No user found with this email", 400));
//     }

//     const token = crypto.randomBytes(32).toString("hex");
//     const expiration = Date.now() + 900000;

//     await user.update({ resetToken: token, resetTokenExpiration: expiration });

//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: user.email,
//       subject: "Password Reset",
//       text: `You requested a password reset. Use the following link to reset your password:
//              ${process.env.FRONTEND_URL}/reset-password/${token}
//              This link is valid for 15 minutes.`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({
//       status: "Success",
//       message: "Password reset email sent",
//     });
//   } catch (err) {
//     return next(new ApiError("Failed to send reset password email", 500));
//   }
// };

// const resetPassword = async (req, res, next) => {
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     const user = await User.findOne({
//       where: {
//         resetToken: token,
//         resetTokenExpiration: {
//           [Op.gt]: Date.now(),
//         },
//       },
//     });

//     if (!user) {
//       return next(new ApiError("Invalid or expired token", 400));
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await user.update({
//       password: hashedPassword,
//       resetToken: null,
//       resetTokenExpiration: null,
//     });

//     res.status(200).json({
//       status: "Success",
//       message: "Password reset successfully",
//     });
//   } catch (err) {
//     return next(new ApiError("Failed to reset password", 500));
//   }
// };

module.exports = {
  register,
  login,
};
