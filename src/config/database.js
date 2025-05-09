const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://vysakhrbz:testUser@clustertest.cbrtn.mongodb.net/dev-tinder",
  );
}

module.exports = connectDB;
