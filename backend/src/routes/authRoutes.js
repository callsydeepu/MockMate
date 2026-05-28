const express = require("express");
const { registerUser,loginUser,getMe } = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");
const passport = require("passport");

const generateToken = require("../utils/generateToken");
const { body } = require("express-validator");
const validate = require("../middlewares/validationMiddleware");
const router = express.Router();

router.post(
  "/register",

  [
    body("name").notEmpty().withMessage("Name required"),

    body("email")
      .isEmail()
      .withMessage("Valid email required"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters"),
  ],
  validate,
  registerUser
);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

router.get(
  "/google",

  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),

  async (req, res) => {
    const token = generateToken(req.user._id);

    res.redirect(
      `http://localhost:5173/oauth-success?token=${token}`
    );
  }
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: true,
  }),
  async (req, res) => {
    console.log("[DEBUG] GitHub OAuth Callback - User authenticated successfully:", req.user._id);
    const token = generateToken(req.user._id);
    console.log("[DEBUG] GitHub OAuth Callback - Generated JWT:", token);
    res.redirect(
      `http://localhost:5173/oauth-success?token=${token}`
    );
  }
);

module.exports = router;