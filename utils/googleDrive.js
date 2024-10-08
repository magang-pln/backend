require("dotenv").config();
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY_PATH);

// Inisialisasi Google Drive API dengan Service Account
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const driveService = google.drive({ version: "v3", auth });

// Fungsi untuk mengupload file ke Google Drive
const uploadFile = async (
  filePath,
  mimeType,
  folderId = "14j3yIadfiE5nHos286rvkxqQpRIJYZVB"
) => {
  const fileMetadata = {
    name: path.basename(filePath),
    parents: folderId ? [folderId] : [],
  };

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  try {
    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    return response.data.id;
  } catch (error) {
    throw new Error(`Error uploading file to Google Drive: ${error.message}`);
  }
};

// Fungsi untuk mendownload file dari Google Drive
const downloadFileFromDrive = async (fileId, res) => {
  try {
    const response = await driveService.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    res.set({
      "Content-Type": response.headers["content-type"],
      "Content-Disposition": `attachment; filename="${response.headers["x-goog-file-name"]}"`,
    });

    response.data
      .on("end", () => {
        console.log("File downloaded successfully.");
      })
      .on("error", (err) => {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Error downloading file" });
      })
      .pipe(res);
  } catch (error) {
    res.status(500).json({ error: `Error downloading file: ${error.message}` });
  }
};

module.exports = { uploadFile, downloadFileFromDrive, driveService };
