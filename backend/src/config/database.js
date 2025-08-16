const mongoose = require('mongoose');

const dbConnect = async () => {
    await mongoose.connect(process.env.MONGO_URI);
}
module.exports = {dbConnect};