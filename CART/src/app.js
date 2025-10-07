const express = require("express")
const router = require("./routes/cart.route")

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/cart", router)

module.exports = app;