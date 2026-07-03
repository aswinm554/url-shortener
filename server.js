const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const urlRoutes = require("./src/routes/url.routes")
const { errorHandler } = require("./src/middleware/error.middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/url", urlRoutes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});