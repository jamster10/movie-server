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


app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

//Handle authentication
app.use(checkAuthorization);

//Handle right parameters
app.use(checkQuery);

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
    if(genres.filter(item => item.includes(genre.toLowerCase())).length === 0){
      err.status = 400;
      err.message = 'Bad request: Genre does not existent';
      return next(err);
    }
    results = MOVIES.filter(movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  //filter by country or throw error
  if (country){
    if(!countries.filter(item => item.includes(country.toLowerCase()))){
      err.status = 400;
      err.message = 'Bad request: Check country spelling';
      return next(err);
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
    if(rating < 0 || rating > 10 || isNaN(rating)){

      err.status = 400;
      err.message = 'Bad request: Check rating value';
      return next(err);
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
  return next(err);  
});

//error handler catch all
app.use((err, req, res, next) => {
  res.status(err.status).json({message: err.message});
});

//Check user token
function checkAuthorization(req, res, next){
  const userToken = req.get('Authorization');
  if (!userToken || userToken.split(' ')[1] !== process.env.API_KEY){
    let error = {
      status: 401,
      message: 'You do not have access to this server. GO AWAY, OR ELSE'
    };
    return next(error);
  }
  next();
}

//Check their actual request
function checkQuery (req, res, next){
  let error;

  const options = ['genre', 'country', 'avg_vote'];
  const chosenKeys = (Object.keys(req.query));

  for (let key of chosenKeys){
    if (!options.includes(key)){
      error = {status: 400, message: `${key} is not a valid option`};
      break; 
    }
  }
  return error ? next(error) : next();
}

module.exports = app;
