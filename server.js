const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const http = require('http')
const users = require('./routes/authRoute.js');

const books = require('./routes/bookRoute.js');

const myDB = require('./lib/db.js')



const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

app.use(cors())
app.use(express.json());

app.get('/', (req, res)=>{
    res.send("Welcome to Book Server")
})


app.use('/api/user', users)
app.use('/api/book', books)


// Connect to MongoDB
myDB()


server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

