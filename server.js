const express = require('express');
const app = express();
const db = require('./db');
const models = db.models;
const { Movie, Director } = models;

const port = process.env.PORT || 3000;

app.get('/movies', (req, res, next)=> {
  Movie.findAll({
    include: [ Director ]
  })
    .then( movies => res.send(movies))
    .catch( err => next(err));
});

app.get('/directors', (req, res, next)=> {
  Director.findAll({
    include: [ Movie ]
  })
    .then( directors => res.send(directors))
    .catch( err => next(err));
});

app.listen(port, ()=> console.log(`listening on port ${port}`));

db.sync()
  .then( ()=> db.seed())
  .then( movies => {
    movies.forEach( movie => console.log(movie.name, movie.director.name, movie.director.id));
  });
