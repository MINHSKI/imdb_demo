const Sequelize = require('sequelize');

if(!process.env.DATABASE_URL){
  throw new Error('set your DATABASE_URL');
}

const _conn = new Sequelize(process.env.DATABASE_URL);

const Movie = _conn.define('movie', {
  name: Sequelize.STRING
});

const Director = _conn.define('director', {
  name: Sequelize.STRING
});

Movie.belongsTo(Director);
Director.hasMany(Movie);

const data = [
  { movieName: 'Goodfellas', directorName: 'Scorcese' },
  { movieName: 'The Breakfast Club', directorName: 'John Hughes' },
  { movieName: 'Some Kind of Wonderful', directorName: 'John Hughes' },
  { movieName: 'Raging Bull', directorName: 'Scorcese' },
];

const seed = ()=> {
  return data.reduce((memo, item)=> {
    return memo.then(()=> generateMovie(item));
  }, Promise.resolve())
    .then(()=> {
      return Movie.findAll({
        include: [ Director ]
      });
    });
};


const sync = ()=> {
  return _conn.sync({ force: true });
};

const generateMovie = (data)=> {
  const { movieName, directorName } = data;
  return Director.findOne({
    where: { name: directorName }
  })
  .then( director => {
    if(director){
      return director;
    }
    return Director.create({ name: directorName });
  })
  .then( director => {
    return Movie.create({ name: movieName, directorId: director.id });
  });

};

module.exports = {
  sync,
  seed,
  models: {
    Movie,
    Director
  }
};

