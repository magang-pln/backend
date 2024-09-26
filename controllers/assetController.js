const { Asset } = require("../models");
const path = require("path");
const fs = require("fs");
const ApiError = require("../utils/apiError");
const apiError = require("../utils/apiError");
const { where } = require("sequelize");

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
      kantah_BPN_sertifiksai,
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
      kantah_BPN_sertifiksai,
      kronologis: files.kronologis ? files.kronologis[0].filename : null,
      sertipikat: files.sertipikat ? files.sertipikat[0].filename : null,
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

const downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading the file:", err);
      res.status(404).send("File not found");
    }
  });
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
      nomor_sertipikat,
      tanggal_berlaku_sertipikat,
      tanggal_berakhir_sertipikat,
      penguasaan_tanah,
      permasalahan_aset,
      kantah_BPN_sertifikasi,
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
        nomor_sertipikat,
        tanggal_berlaku_sertipikat: formattedTanggalBerlaku,
        tanggal_berakhir_sertipikat: formattedTanggalBerakhir,
        penguasaan_tanah,
        permasalahan_aset,
        kantah_BPN_sertifikasi,
        kronologis: files.kronologis
          ? files.kronologis[0].filename
          : asset.kronologis,
        sertipikat: files.sertipikat
          ? files.sertipikat[0].filename
          : asset.sertipikat,
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
  updateAsset,
  deleteAsset,
};
