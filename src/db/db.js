const mongoose = require('mongoose');

const mongoString = process.env.DATABASE_URL

// Database mongoose.connection
mongoose.connect(mongoString)
.then(() => {
    console.log('Connection successful!');
}).catch((e) => {
    console.log('Connection failed!');
})

mongoose.Promise = global.Promise;
