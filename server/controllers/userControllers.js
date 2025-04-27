const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
const registerController = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new Error("Please fill all the fields"));
  }

  try {
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      const error = new Error("User already exists with the provided email");
      error.statusCode = 401;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.json({
      success: true,
      msg: "Registration successful",
    });
  } catch (err) {
    console.log("Error in registerController:", err);
    return next(err);
  }
};

// LOGIN
const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userFound = await UserModel.findOne({ email });
    if (!userFound) {
      const err = new Error("User Not Found! Wrong Credentials");
      err.statusCode = 404;
      return next(err);
    }

    const match = await bcrypt.compare(password, userFound.password);
    if (!match) {
      const err = new Error("Wrong Credentials");
      err.statusCode = 401;
      return next(err);
    }

    const token = jwt.sign(
      { userId: userFound._id },
      process.env.JWT_SECRET || "your-secret-key"
    );

    const tempUser = userFound.toObject();
    delete tempUser.password;

    res.send({
      success: true,
      data: { user: { ...tempUser, token } },
      msg: "Login successful",
    });
  } catch (err) {
    console.log("Error in loginController:", err);
    err.statusCode = 400;
    return next(err);
  }
};

// LOGOUT
const logoutController = async (req, res, next) => {
  const user = req.user;

  if (!user || !user._id) {
    const error = new Error("User not authorized");
    error.statusCode = 401;
    return next(error);
  }

  res.status(200).json({ success: true, msg: "Logout successful", user });
};

// GET ALL USERS
const getAllUsers = async (req, res, next) => {
  const { search } = req.query;

  let searchObj = {};
  if (search) {
    searchObj = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
  }

  try {
    const usersFound = await UserModel.find(searchObj)
      .find({ _id: { $ne: req.user._id } })
      .select("-password");

    res.json({
      success: true,
      result: usersFound,
    });
  } catch (err) {
    console.log("Error in getAllUsers:", err);
    return next(err);
  }
};

// GET SINGLE USER
const getUser = async (req, res, next) => {
  const userId = req.params.userId || req.user._id;

  if (!userId) {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    return next(error);
  }

  try {
    const userFound = await UserModel.findById(userId).select("-password");

    if (!userFound) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      success: true,
      user: userFound,
    });
  } catch (err) {
    console.log("Error in getUser:", err);
    return next(err);
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  getAllUsers,
  getUser,
};
