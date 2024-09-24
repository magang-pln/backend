'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Assets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      unit_induk: {
        type: Sequelize.STRING
      },
      nama_aset: {
        type: Sequelize.STRING
      },
      unit: {
        type: Sequelize.INTEGER
      },
      nomor_SAP: {
        type: Sequelize.INTEGER
      },
      luas: {
        type: Sequelize.INTEGER
      },
      harga_perolehan: {
        type: Sequelize.INTEGER
      },
      tahun_perolehan: {
        type: Sequelize.INTEGER
      },
      nilai_saat_ini: {
        type: Sequelize.INTEGER
      },
      sumber_perolehan: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.TEXT
      },
      kelurahan: {
        type: Sequelize.STRING
      },
      kecamatan: {
        type: Sequelize.STRING
      },
      kota: {
        type: Sequelize.STRING
      },
      provinsi: {
        type: Sequelize.STRING
      },
      nomor_sertipikat: {
        type: Sequelize.TEXT
      },
      tanggal_berlaku_sertipikat: {
        type: Sequelize.DATE
      },
      tanggal_berakhir_sertipikat: {
        type: Sequelize.DATE
      },
      penguasaan_tanah: {
        type: Sequelize.STRING
      },
      permasalahan_aset: {
        type: Sequelize.STRING
      },
      kantah_BPN_sertifiksai: {
        type: Sequelize.STRING
      },
      kronologis: {
        type: Sequelize.TEXT
      },
      sertipikat: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Assets');
  }
};