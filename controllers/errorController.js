// errorController.js
module.exports = (err, req, res, next) => {
  console.error(err); // Log error ke konsol

  // Mengatur status code default jika tidak ada yang ditentukan
  const statusCode = err.statusCode || 500; // Atur ke 500 jika tidak ada status code
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "Error",
    message,
  });
};
