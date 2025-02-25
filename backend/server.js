const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
// Middleware
app.use(cors());
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function connect_to_db () {
  // Connect to MongoDB
  const uri = process.env.ATLAS_URI;
  mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log("MongoDB database is connected successfully");
  })

  // Direct route http://localhost:4000/users
  const coursesRouter = require('./routes/courses');
  app.use('/courses', coursesRouter);
  const usersRouter = require('./routes/users');
  app.use('/api/users', usersRouter);
  const commentsRouter = require('./routes/comments');
  app.use('/comments', commentsRouter);

  // Passport middleware
  app.use(passport.initialize());
  // Passport config
  require("./passport")(passport);

  app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
  });

}

connect_to_db();
module.exports = app; // for testing