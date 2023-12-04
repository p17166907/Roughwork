const express = require('express');
const app = express();

// Connect to the database
const connectDB = require('./db/connect-db');
// Load environment variables for database configuration
require('dotenv').config();
// Extract database credentials from environment variables
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DBNAME } = process.env;


app.use(express.json()); // Parse incoming JSON payloads

// Import routes
const authRouter = require('./routes/auth-routes');

const jobsRouter = require('./routes/jobs-routes');


// error handler
const notFoundMiddleware = require('./middleware/not-found-middleware');
const errorHandlerMiddleware = require('./middleware/error-handler-middleware');

const authenticateUser = require('./middleware/authentication-middleware');

// routes
//Api routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Set up the application port
const port = process.env.PORT || 3000;

const start = async () => {
    try {
        // Add/ insert the mongo db credentials with the mongo db connection string
        const connectionString = `mongodb+srv://${encodeURIComponent(
            MONGO_USERNAME
        )}:${encodeURIComponent(MONGO_PASSWORD)}@nodeexpressjstutorial.cyqm3ex.mongodb.net/${MONGO_DBNAME}?retryWrites=true&w=majority`;

        // Connect to the database - connectDB() takes a url string
        await connectDB(connectionString);

        // Start the Express server on the specified port
        app.listen(port, () => { console.log(`Server is listening on port ${port}....`); });

    } catch (error) {

    }
}
start()