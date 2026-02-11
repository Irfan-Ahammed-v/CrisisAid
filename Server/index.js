const app = require("./app");
const connectDB = require("./config/db");

const port = 5000;

connectDB(); // Connect to the database

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
