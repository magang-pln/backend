const router = require("express").Router();
const Auth = require("../controllers/authController");
const loginLimiter = require("../middleware/rateLimit");

router.post("/register", Auth.register);
router.post("/login", loginLimiter, Auth.login);
// router.post("/reset-password-request", Auth.resetPasswordRequest);
// router.post("/reset-password/:token", Auth.resetPassword);

module.exports = router;
