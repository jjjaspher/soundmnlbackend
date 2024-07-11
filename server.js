const express = require('express');
const cors = require('cors');
require('dotenv').config()
const bodyParser = require('body-parser');
const sequelize = require('./database/dbConnection');
const User = require('./models/userModel')
// const Rate = require('./models/rateModel')
const Book = require('./models/bookModel')
const passport = require('passport');

require('./passport')(passport);
const app = express();
const port = process.env.PORT || 3030;

sequelize.sync();

app.use(passport.initialize());
app.use(cors());
app.use(bodyParser.json());

const userAPI = require('./api/userApi');
app.use('/api/user', userAPI);

const bookAPI = require('./api/bookApi');
app.use('/api/book', bookAPI);

// const rateAPI = require('./api/rateAPI');
// app.use('/api/rate', rateAPI);

const auth = require('./api/auth');
app.use('/api', auth);

app.listen(port, () => {
    console.log(`Server is served at ${port}`);
})

