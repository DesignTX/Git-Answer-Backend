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
  console.log("posting usersdrefdsvxc");
  console.log(req.body);
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let newUser = await User.findOne({ email: req.body.email });
    if (newUser) return res.status(400).send("User already registered");
  } catch (err) {
    res.status(400).send(`There has been an error: ${err}`);
  }

  try {
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
  } catch (err) {
    console.log("We're here");
    res.status(400).send(`There has been an error: ${err}`);
  }
});

router.post("/login", async (req, res) => {
  console.log("login");
  const { username, password } = req.body;
  try {
    const foundUser = await User.findOne({ username: username });
    if (!foundUser) return res.status(400).send("Incorrect Details (username)");
    const result = bcrtpt.compareSync(password, foundUser.password);
    if (!result) return res.status(400).send("Incorrect Details (password)");
    const token = foundUser.generateAuthToken();
    return res.status(200).send(token);
  } catch (err) {
    return res.status(400).send(`There has been an error: ${err}`);
  }
});

module.exports = router;
