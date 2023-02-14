const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/user");

//CRUD
/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    let users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    //possibly send error code
    res.status(400).send(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    //get user input
    const { name, email, password } = req.body;

    //validate user input
    if (!(name && email && password)) {
      res.status(400).send("Email, name and password are required");
    }

    // check if user already exists
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    //add user to the database
    const user = await User.create({
      name: name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    //possibly send error code
    res.status(400).send(err);
  }
});

router.put("/:id", async function (req, res, next) {
  //cannot update email nor pass
  //validate user input
  if (!req.body.name && (req.body.email || req.body.password)) {
    res.status(400).send("Only name can be updated");
  }

  try {
    //update user
    let updatedUser = await User.updateOne({ _id: req.params.id }, req.body);

    //find the updated user
    updatedUser = await User.findById(req.params.id);

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    //possibly send error code
    res.status(400).send(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    await User.deleteOne({ _id: req.params.id });
    //possibly send back a code
    res.status(200).send("User Deleted");
  } catch (err) {
    console.log(err);
    //possibly send error code
    res.status(400).send(err);
  }
});

module.exports = router;
