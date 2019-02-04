require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 4000;
const massive = require("massive");
const session = require("express-session");
const { json } = require("body-parser");
const { register, login, logout } = require('./controllers/authController');
const {
  dragonTreasure,
  getUserTreasure,
  addUserTreasure,
  getAllTreasure
} = require("./controllers/treasureController");
const { usersOnly, adminsOnly } = require('./middleware/authMiddleware');

app.use(json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false
  })
);

massive(process.env.CONNECTION_STRING).then(dbInstance => {
  console.log("Database connected");
  app.set("db", dbInstance);
});

app.post('/auth/register', register);
app.post('/auth/login', login);
app.get('/auth/logout', logout);
app.get('/api/treasure/dragon', dragonTreasure);
app.get('/api/treasure/user', usersOnly, getUserTreasure);
app.post('/api/treasure/user', usersOnly, addUserTreasure);
app.get('/api/treasure/all', usersOnly, adminsOnly, getAllTreasure);


app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
