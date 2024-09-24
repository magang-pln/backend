const router = require("express").Router();
const Auth = require("../controllers/authController");
const loginLimiter = require("../middleware/rateLimit");

router.post("/register", Auth.register);
router.post("/login", loginLimiter, Auth.login);

module.exports = router;
