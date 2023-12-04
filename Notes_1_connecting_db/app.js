const express = require('express');
const app = express();

// Import routes
const notesRoutes = require('./routes/notes-routes');

//connect the db
let connectDB = require('./db/connect-db');
//Load environment variables/db access credentials from '.env' file 
require('dotenv').config(); // Load environment variables from '.env' file for database configuration
// Extract database credentials from environment variables
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DBNAME } = process.env;


//parse request body as json
app.use(express.json());

//Api routes
app.use('/api/v1/notes', notesRoutes)
//Handle all other unspecified routes with a 404 error page
app.all('*', (req, res) => { res.status(404).send(`<h1>${res.statusCode} page Not Found</h1>`) })

//Start up the server and with the db
const port = 3000
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