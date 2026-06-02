require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
    console.log("Attempting to connect to:", process.env.MONGO_URI ? "URI found" : "URI MISSING");
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("✅ Database connectivity verified!");
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Available collections:", collections.map(c => c.name));
        
        const campCount = await mongoose.model("tbl_reliefcamp").countDocuments();
        console.log(`Successfully queried tbl_reliefcamp. Count: ${campCount}`);
        
        process.exit(0);
    } catch (err) {
        console.error("❌ Database connection test FAILED:");
        console.error(err.message);
        console.log("\nPossible causes:");
        console.log("1. Your IP address might not be whitelisted in MongoDB Atlas.");
        console.log("2. Your internet connection is blocking the MongoDB port (27017).");
        console.log("3. The Atlas cluster is paused or down.");
        process.exit(1);
    }
};

testConnection();
