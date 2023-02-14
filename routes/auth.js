const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const User = require("../models/user");
const bcrypt = require("bcryptjs");

// User logins
router.post("/login", async function (req, res, next) {
  //login and give user a token
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ user_id: user._id, email }, "foobar", {
        expiresIn: "2h",
      });

      //response - pass back token and user object
      let response = {
        user,
        token,
      };

      // user
      return res.status(200).json(response);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

// ○ Email verifications
router.post("/verify/:email", async function (req, res, next) {
  //verify email
  const { email } = req.params;
  //can't login if email is not verified
  //update user object with emailVerified true

  // Validate user input
  if (!email) {
    res.status(400).send("Email is required");
  }

  let emailVerified = true;

  try {
    console.log("updating user with email: ", email);
    //update user
    let updatedUser = await User.updateOne({ email }, { emailVerified });

    //find the updatedUser
    updatedUser = await User.findOne({ email });

    //return the user object\
    console.log("returning user", updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    //possibly send error code
    res.status(400).send(err);
  }
});

// ○ Forgotten password retrievals
router.post("/forgot-password", function (req, res, next) {
  //doesn't need jwt

  res.send("respond with a resource");
});

// ○ Refreshing a JWT

router.post("/refresh", async function (req, res, next) {
  //pass token and user
  const { accessToken, user } = req.body;

  if (!accessToken && user) {
    return res.status(406).json({ message: "Unauthorized" });
  }

  // Verifying refresh token
  jwt.verify(accessToken, "foobar", (err, decoded) => {
    if (err) {
      // Wrong Refesh Token
      return res.status(406).json({ message: "Unauthorized" });
    } else {
      // Correct token we send a new access token
      const token = jwt.sign({ user_id: user._id, email }, "foobar", {
        expiresIn: "2h",
      });
      return res.json({ user, token });
    }
  });
});

module.exports = router;
