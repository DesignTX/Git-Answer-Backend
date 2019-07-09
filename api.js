require("dotenv").config();
const app = require("./express")
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;

// IIFE To Connect to database and catch any errors
(async function dbconnect() {
  try {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useCreateIndex: true }); 
    console.info("Connected to MongoDB");
  } catch (error) {
    console.error(errror);
    throw new Error(`Unable to connect to database: ${process.env.DB_URL}`);
    process.exit(1);
  }
})();

app.get("/test", (req, res) => {
  res.status(200).send("Accessed Endpoint!!");
});

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});

