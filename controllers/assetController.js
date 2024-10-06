const { Asset } = require("../models");
const path = require("path");
const fs = require("fs");
const ApiError = require("../utils/apiError");
const apiError = require("../utils/apiError");
const { uploadFile } = require("../utils/googleDrive");

const findAssets = async (req, res, next) => {
  try {
    const findAssets = await Asset.findAll();
    if (!findAssets) {
      throw new Error("Assets model is not defined");
    }

    res.status(200).json({
      status: "Success",
      data: {
        findAssets,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const findAssetById = async (req, res, next) => {
  try {
    const findAsset = await Asset.findByPk(req.params.id);

    if (!findAsset)
      return next(
        new ApiError(`Cannot find car with id : ${req.params.id}`, 400)
      );

    res.status(200).json({
      status: "Success",
      data: {
        findAsset,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const createAsset = async (req, res, next) => {
  try {
    const files = req.files;
    console.log(files);

    const {
      unit_induk,
      nama_aset,
      unit,
      nomor_SAP,
      luas,
      harga_perolehan,
      tahun_perolehan,
      nilai_saat_ini,
      sumber_perolehan,
      alamat,
      kelurahan,
      kecamatan,
      kota,
      provinsi,
      nomor_sertipikat,
      tanggal_berlaku_sertipikat,
      tanggal_berakhir_sertipikat,
      penguasaan_tanah,
      permasalahan_aset,
      kantah_BPN_sertifikasi,
      kordinat_x,
      kordinat_y,
    } = req.body;

    let formattedTanggalBerlaku = null;
    if (tanggal_berlaku_sertipikat) {
      const [day, month, year] = tanggal_berlaku_sertipikat.split("/");
      formattedTanggalBerlaku = `${year}-${month}-${day}`;
    }

    let formattedTanggalBerakhir = null;
    if (tanggal_berakhir_sertipikat) {
      const [endDay, endMonth, endYear] =
        tanggal_berakhir_sertipikat.split("/");
      formattedTanggalBerakhir = `${endYear}-${endMonth}-${endDay}`;
    }

    let kronologisFileId = null;
    let sertipikatFileId = null;

    if (files.kronologis) {
      const kronologisPath = files.kronologis[0].path;
      const mimeType = files.kronologis[0].mimeType;
      kronologisFileId = await uploadFile(kronologisPath, mimeType);
    }

    if (files.sertipikat) {
      const sertipikatPath = files.sertipikat[0].path;
      const mimeType = files.sertipikat[0].mimeType;
      sertipikatFileId = await uploadFile(sertipikatPath, mimeType);
    }

    const newAsset = await Asset.create({
      unit_induk,
      nama_aset,
      unit,
      nomor_SAP,
      luas,
      harga_perolehan,
      tahun_perolehan,
      nilai_saat_ini,
      sumber_perolehan,
      alamat,
      kelurahan,
      kecamatan,
      kota,
      provinsi,
      nomor_sertipikat,
      tanggal_berlaku_sertipikat: formattedTanggalBerlaku,
      tanggal_berakhir_sertipikat: formattedTanggalBerakhir,
      penguasaan_tanah,
      permasalahan_aset,
      kantah_BPN_sertifikasi,
      kordinat_x,
      kordinat_y,
      kronologis: kronologisFileId,
      sertipikat: sertipikatFileId,
    });

    if (!newAsset) {
      return next(new ApiError("Failed to create new asset data", 500));
    }

    const responseAsset = {
      ...newAsset.get(),
      tanggal_berlaku_sertipikat: tanggal_berlaku_sertipikat,
      tanggal_berakhir_sertipikat: tanggal_berakhir_sertipikat,
    };

    res.status(200).json({
      status: "Success",
      data: {
        newAsset: responseAsset,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const downloadFile = (req, res, next) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File does not exist:", err);
      return next(new apiError(err.message, 404));
    }

    res.download(filePath, (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        return next(new apiError(err.message, 500));
      }
    });
  });
};

const findAssetFilesById = async (req, res, next) => {
  try {
    const findAsset = await Asset.findByPk(req.params.id);

    if (!findAsset) {
      return next(
        new ApiError(`Cannot find asset with id: ${req.params.id}`, 400)
      );
    }

    // Mengambil ID file kronologis dan sertipikat dari asset
    const { kronologis, sertipikat } = findAsset;

    res.status(200).json({
      status: "Success",
      data: {
        kronologis,
        sertipikat,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const id = req.params.id;
    const files = req.files;

    const {
      unit_induk,
      nama_aset,
      unit,
      nomor_SAP,
      luas,
      harga_perolehan,
      tahun_perolehan,
      nilai_saat_ini,
      sumber_perolehan,
      alamat,
      kelurahan,
      kecamatan,
      kota,
      provinsi,
      nomor_sertipikat,
      tanggal_berlaku_sertipikat,
      tanggal_berakhir_sertipikat,
      penguasaan_tanah,
      permasalahan_aset,
      kantah_BPN_sertifikasi,
      kordinat_x,
      kordinat_y,
    } = req.body;

    let formattedTanggalBerlaku = null;
    if (tanggal_berlaku_sertipikat) {
      const [day, month, year] = tanggal_berlaku_sertipikat.split("/");
      formattedTanggalBerlaku = `${year}-${month}-${day}`;
    }

    let formattedTanggalBerakhir = null;
    if (tanggal_berakhir_sertipikat) {
      const [endDay, endMonth, endYear] =
        tanggal_berakhir_sertipikat.split("/");
      formattedTanggalBerakhir = `${endYear}-${endMonth}-${endDay}`;
    }

    const asset = await Asset.findOne({
      where: {
        id,
      },
    });

    if (!asset) {
      return next(new apiError(`Asset with id '${id}' is not found`, 404));
    }

    let kronologisFileId = asset.kronologis;
    let sertipikatFileId = asset.sertipikat;

    if (files.kronologis) {
      const kronologisPath = files.kronologis[0].path;
      const mimeType = files.kronologis[0].mimeType;
      kronologisFileId = await uploadFile(kronologisPath, mimeType);
    }

    if (files.sertipikat) {
      const sertipikatPath = files.sertipikat[0].path;
      const mimeType = files.sertipikat[0].mimeType;
      sertipikatFileId = await uploadFile(sertipikatPath, mimeType);
    }

    await Asset.update(
      {
        unit_induk,
        nama_aset,
        unit,
        nomor_SAP,
        luas,
        harga_perolehan,
        tahun_perolehan,
        nilai_saat_ini,
        sumber_perolehan,
        alamat,
        kelurahan,
        kecamatan,
        kota,
        provinsi,
        nomor_sertipikat,
        tanggal_berlaku_sertipikat: formattedTanggalBerlaku,
        tanggal_berakhir_sertipikat: formattedTanggalBerakhir,
        penguasaan_tanah,
        permasalahan_aset,
        kantah_BPN_sertifikasi,
        kordinat_x,
        kordinat_y,
        kronologis: kronologisFileId,
        sertipikat: sertipikatFileId,
      },
      {
        where: {
          id,
        },
      }
    );

    const updatedAset = await Asset.findOne({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Asset updated",
      data: {
        updatedAset,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    const id = req.params.id;
    const asset = await Asset.findOne({
      where: { id },
    });

    if (!asset) {
      return next(new ApiError(`Asset with id '${id}' is not found`, 404));
    }

    await asset.destroy();

    res.status(200).json({
      status: "Success",
      message: `Asset with id '${id}' has been deleted successfully`,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  findAssets,
  findAssetById,
  createAsset,
  downloadFile,
  findAssetFilesById,
  updateAsset,
  deleteAsset,
};
