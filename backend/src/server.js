const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const connectDB = require("./config/db");


app.use(express.json());
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});