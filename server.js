'use strict';

const MOVIES = require('./movie_data');
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const movieHandlers = require('./genres_movies');

//get genres & countries for faster error check
const genres = movieHandlers.getGenres(MOVIES);
const countries = movieHandlers.getCountries(MOVIES);


//handle CORS & add further protection
const cors = require('cors');
const helmet = require ('helmet');

const app = express();
const PORT = 8080;

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(checkAuthorization);

//Handle authentication

//main route
app.get('/movie', (req, res, next)=>{
  let err = {};
  let results =[];
  let { genre, country, avg_vote } = req.query;
  if (!genre && !country && !avg_vote){
    let err = {status: 413, message: 'Your request is too large. Please filter'};
    return next(err);
  }
  
  //filter by genre or throw error
  if (genre){
    if(!genres.includes(genre.toLowerCase())){
      err.status = 400;
      err.message = 'Bad request: Genre does not existent';
      next(err);
    }
    results = MOVIES.filter(movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }
  //filter by country or throw error
  if (country){
    if(!countries.includes(country)){
      err.status = 400;
      err.message = 'Bad request: Check country spelling';
      next(err);
    }
    
    results = results.length > 0 ? results.filter(movie => 
      movie.country.toLowerCase().includes(country.toLowerCase())
    ) : MOVIES.filter(movie => 
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  }
  
  //filter by rating or throw error
  if (avg_vote){
    const rating = Number(avg_vote);
    if(rating < 0 || rating > 10){
      console.log('sasasas');
      err.status = 400;
      err.message = 'Bad request: Check rating value';
      next(err);
    }
    results = results.length > 0 ? results.filter(movie => movie.avg_vote >= rating) : MOVIES.filter(movie => movie.avg_vote >= rating);
  }
  //reduce server output to be manageable
  if (results.length > 50) results.length = 50;
  results = [{count: results.length}, ...results];
  

  //send the final response
  return res.status(200).json(results);
});

//if not route matched
app.use( (req, res, next) => {
  const err = {
    status: 404,
    message:'The requested resource not found'
  };
  next(err);
});

//error handler catch all
app.use((err, req, res, next) => {
  res.status(err.status).json(err.message);
});


//start listening
app.listen(PORT, console.log('The Portal has opened. Welcome!'));


//Check user token
function checkAuthorization(req, res, next){
  const userToken = req.get('Authorization');
  if (!userToken || userToken.split(' ')[1] !== process.env.API_KEY){

    res.status(401).json({
      status: 401,
      error: 'You do not have access to this server. GO AWAY, OR ELSE'
    });
  }
  next();
}
