const router = require("express").Router();

const Auth = require("./authRouter");
const Assets = require("./assetRouter");

router.use("/api/v1/auth", Auth);
router.use("/api/v1/assets", Assets);

module.exports = router;
