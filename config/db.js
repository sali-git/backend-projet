const mongoose = require("mongoose");

const connectToMongoDb = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI n'est pas défini dans le fichier .env");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected !");
    } catch (error) {
        console.error("Mongo error:", error.message);
        process.exit(1);
    }
}

module.exports = { connectToMongoDb };
