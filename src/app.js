require('dotenv').config();
// const cors = require('cors');
require('./db/db');
const express = require('express');
// const bodyParser = require('body-parser');
// const swaggerDocs = require('./swagger');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs =  require('./swagger/swagger2_0.json');

//connection
const PORT = process.env.PORT || 3000;

const app = express();
// Allow request from any source. In real production, this should be limited to allowed origins only
// app.use(cors());

//MIDDLEWARE
app.use(express.json({ limit: "10MB" }));
app.use(express.urlencoded({ extended: true }));


//LOG MIDDLEWARE
const logger = require("./middleware/logger");
app.use(logger);


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// default homepages
app.get('/', (req, res) => {
    res.send('API UP and running...').status(200);
});
app.get('/api', (req, res) => {
    res.send('API UP and running...').status(200);
});


//routes
const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

// ADD AUTH MIDDLEWARE
const auth = require('./middleware/auth');
//auth middleware to verify token on each request
// app.use();

const userRoutes = require('./routes/user.routes');
app.use('/api', auth, userRoutes);

const chatRoutes = require('./routes/chat.routes');
app.use('/api', auth, chatRoutes);


/** start server only when we have valid connection */
try {
    app.listen(PORT, () => {
        console.log(`Server connected to http://localhost:${PORT}`);
    })
    // swaggerDocs(app, PORT);
} catch (error) {
    console.error('Cannot connect to the server ->' + error.message);
}

// app.listen(PORT, () => {
//     console.log("Server Listening on PORT:", PORT);
// });