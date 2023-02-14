const express = require("express");
const router = express.Router();

const Role = require("../models/role");

//CRUD
/* GET roles listing. */
router.get("/", async function (req, res, next) {
  try {
    //grab all roles
    let roles = await Role.find({});
    return res.status(200).json(roles);
  } catch (err) {
    console.log(err);
    //possibly send error code
    res.status(400).send(err);
  }
});

//create role - assigning role to user
router.post("/", async function (req, res, next) {
  try {
    //get user input
    const { email, roleName } = req.body;

    //validate user input
    if (!(email && roleName)) {
      res.status(400).send("Email and role name are required");
    }

    // check if user already has a role
    const hasRole = await Role.findOne({ email });

    if (hasRole) {
      return res.status(409).send("User Already Has a Role.");
    }

    //create role
    const createdRole = await Role.create({
      email: email.toLowerCase(),
      roleName,
    });

    // return created role
    res.status(201).json(createdRole);
  } catch (err) {
    console.log(err);
    //possibly send error code
    res.status(400).send(err);
  }
});

//update role - update role of user
router.put("/:id", async function (req, res, next) {
  const { email, roleName } = req.body;

  //validate user input
  if (!(roleName && email && req.params.id)) {
    res.status(400).send("Need Role Name and Email for role to be updated.");
  }

  try {
    //must unassign user from role
    // check if user already has a role
    const hasRole = await Role.findOne({ email });

    if (hasRole) {
      return res.status(409).send("User Already Has a Role.");
    }

    //update role
    let updatedRole = await Role.updateOne({ _id: req.params.id }, req.body);

    //find the updated role
    updatedRole = await Role.findById(req.params.id);

    res.status(200).json(updatedRole);
  } catch (err) {
    console.log(err);
    //possibly send error code
    res.status(400).send(err);
  }
});

//unassign role
router.delete("/:id", async function (req, res, next) {
  try {
    await Role.deleteOne({ _id: req.params.id });
    //possibly send back a code
    res.status(200).send("Role Deleted");
  } catch (err) {
    console.log(err);
    //possibly send error code
    res.status(400).send(err);
  }
});

module.exports = router;
