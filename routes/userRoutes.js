const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const authMiddleware = require("../middleware/authMiddleware.js");

// Login an user
router.get("/", async (req, res) => {
  const { email, password } = req.body;

  // check if email is valid
  if (!isEmail(email)) return res.status(401).send("Invalid Email");

  try {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    // check if user exists
    if (!user) {
      return res.status(401).send("Invalid Username");
    }

    // verify password
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).send("Invalid Password");
    }

    // generate jwt token
    const payload = { userId: user._id };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        // setToken(token);
        res.cookie("token", token).status(200).send("User LogedIn successfully");
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// create new user
router.post("/", async (req, res) => {
  const { email, password, name } = req.body;

  // check if email is valid
  if (!isEmail(email)) return res.status(401).send("Invalid Email");

  try {
    user = new UserModel({
      name,
      email: email.toLowerCase(),
      password,
    });

    // hash password
    user.password = await bcrypt.hash(password, 10);
    // save user
    await user.save();

    // generate jwt token
    const payload = { userId: user._id };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: "2d" },
      (err, token) => {
        if (err) throw err;
        // setToken(token);
        res.cookie("token", token).status(200).send("User Created");
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// edit an user
router.put("/", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  const user = await UserModel.findById(userId).select("+password");
  try {

    //check if user exists
    if (!user) {
      res.status(500).send("User Not Found");
    }

    // edit password
    const { newUsername, newEmail } = req.body;

    // check if email is valid
    if (!isEmail(newEmail)) return res.status(401).send("Invalid new email");

    await UserModel.findByIdAndUpdate(userId, { name: newUsername, email : newEmail.toLowerCase() });

    res.status(200).send("Success! User info updated");
  } catch (error) {
    res.status(500).send(error);
  }
});

// delete an user
router.delete("/", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  const user = await UserModel.findById(userId);
  try {

    // check if user exists
    if (!user) {
      res.status(500).send("User Not Found");
    }
    // delete the user
    await UserModel.findByIdAndDelete(userId);
    res.clearCookie("token");
    res.status(200).send("Success! User Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;