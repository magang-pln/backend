"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Asset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Asset.init(
    {
      unit_induk: DataTypes.STRING,
      nama_aset: DataTypes.STRING,
      unit: DataTypes.INTEGER,
      nomor_SAP: DataTypes.INTEGER,
      luas: DataTypes.INTEGER,
      harga_perolehan: DataTypes.INTEGER,
      tahun_perolehan: DataTypes.INTEGER,
      nilai_saat_ini: DataTypes.INTEGER,
      sumber_perolehan: DataTypes.STRING,
      alamat: DataTypes.TEXT,
      kelurahan: DataTypes.STRING,
      kecamatan: DataTypes.STRING,
      kota: DataTypes.STRING,
      provinsi: DataTypes.STRING,
      nomor_sertipikat: DataTypes.TEXT,
      tanggal_berlaku_sertipikat: DataTypes.DATE,
      tanggal_berakhir_sertipikat: DataTypes.DATE,
      penguasaan_tanah: DataTypes.STRING,
      permasalahan_aset: DataTypes.STRING,
      kantah_BPN_sertifikasi: DataTypes.STRING,
      kronologis: DataTypes.TEXT,
      sertipikat: DataTypes.TEXT,
      kordinat_x: DataTypes.TEXT,
      kordinat_y: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Asset",
    }
  );
  return Asset;
};
