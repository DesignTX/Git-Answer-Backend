const _ = require("lodash");
const bcrtpt = require("bcrypt");
const { User, validateUser } = require("../models/User");
const express = require("express");
const router = express.Router();

router.get("/me", async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  req.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let newUser = await User.findOne({ email: req.body.email });
  if (newUser) return res.status(400).send("User already registered");

  newUser = await User.findOne({ email: req.body.username });
  if (newUser) return res.status(400).send("Username taken");

  newUser = new User(_.pick(req.body, ["username", "email", "password"]));

  const salt = await bcrtpt.genSalt(10);
  newUser.password = await bcrtpt.hash(newUser.password, salt);
  await newUser.save();

  const token = newUser.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(newUser, ["_id", "username", "email"]));
});

module.exports = router;