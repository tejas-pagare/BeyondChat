const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to Database
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("MONGODB", process.env.MONGO_URI);
    console.log(`Server running on port ${PORT}`);
});
