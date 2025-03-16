const express = require("express");
const router = express.Router();
const { Signin, Signup } = require("../controllers/user.controller");

router.post("/signin", Signin);
router.post("/signup", Signup);

module.exports = router;
