require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const apiError = require("./utils/apiError");
const errorHandler = require("./controllers/errorController");
const router = require("./routes");

const PORT = process.env.PORT;

const app = express();

app.set("trust proxy", true);

// Konfigurasi CORS
const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.options("*", cors(corsOptions));

app.use(router);

app.all("*", (req, res, next) => {
  next(new apiError("Routes doesn't exist", 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
