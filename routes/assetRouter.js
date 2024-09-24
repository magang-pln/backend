const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const assetController = require("../controllers/assetController");

router.get("/", assetController.findAssets);
router.get("/:id", assetController.findAssetById);
router.post(
  "/",
  upload.fields([{ name: "kronologis" }, { name: "sertipikat" }]),
  assetController.createAsset
);
router.get("/download/:filename", assetController.downloadFile);
router.patch(
  "/update/:id",
  upload.fields([{ name: "kronologis" }, { name: "sertipikat" }]),
  assetController.updateAsset
);
router.delete("/:id", assetController.deleteAsset);

module.exports = router;
