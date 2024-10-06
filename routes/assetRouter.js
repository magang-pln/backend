const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const apiError = require("../utils/apiError");
const assetController = require("../controllers/assetController");
const { downloadFileFromDrive } = require("../utils/googleDrive");

router.get("/files/:id", assetController.findAssetFilesById);
router.get("/download/:fileId", (req, res) => {
  const fileId = req.params.fileId;
  downloadFileFromDrive(fileId, res);
});
router.get("/", assetController.findAssets);
router.get("/:id", assetController.findAssetById);
router.post(
  "/",
  upload.fields([{ name: "kronologis" }, { name: "sertipikat" }]),
  assetController.createAsset
);
router.patch(
  "/update/:id",
  upload.fields([{ name: "kronologis" }, { name: "sertipikat" }]),
  assetController.updateAsset
);
router.delete("/:id", assetController.deleteAsset);

module.exports = router;
